import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';

type VerifiedToken = Pick<admin.auth.DecodedIdToken, 'uid' | 'email'>;

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);
  private ready = false;
  private projectId = '';

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.projectId = this.config.get<string>('FIREBASE_PROJECT_ID', '').trim();
    if (!this.projectId) {
      this.logger.warn(
        'FIREBASE_PROJECT_ID lipsește — autentificarea Google este dezactivată',
      );
      return;
    }

    if (admin.apps.length) {
      this.ready = true;
      return;
    }

    const pathSetting = this.config.get<string>('FIREBASE_SERVICE_ACCOUNT_PATH');
    let initialized = false;

    if (pathSetting) {
      const repoRoot = resolve(__dirname, '..', '..', '..');
      const accountPath = isAbsolute(pathSetting)
        ? pathSetting
        : resolve(repoRoot, pathSetting);

      if (existsSync(accountPath)) {
        try {
          const serviceAccount = JSON.parse(
            readFileSync(accountPath, 'utf8'),
          ) as admin.ServiceAccount;

          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: this.projectId,
          });
          initialized = true;
          this.logger.log('Firebase Admin inițializat (service account)');
        } catch (error) {
          this.logger.error(
            `Nu pot încărca contul de serviciu (${accountPath})`,
            error,
          );
        }
      } else {
        this.logger.warn(
          `Service account inexistent (${accountPath}) — folosesc doar projectId`,
        );
      }
    }

    if (!initialized) {
      admin.initializeApp({ projectId: this.projectId });
      this.logger.log(
        `Firebase Admin inițializat pentru ${this.projectId} (verificare token)`,
      );
    }

    this.ready = true;
  }

  get isReady(): boolean {
    return this.ready;
  }

  async verifyIdToken(idToken: string): Promise<VerifiedToken> {
    if (!this.ready) {
      throw new ServiceUnavailableException(
        'Autentificarea Google nu este configurată pe server',
      );
    }

    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      return { uid: decoded.uid, email: decoded.email };
    } catch (error) {
      this.logger.warn(`verifyIdToken eșuat: ${error}`);
      throw new UnauthorizedException('Token Firebase invalid sau expirat');
    }
  }
}
