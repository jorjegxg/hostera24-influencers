# Pași manuali în Firebase Console (2 minute)

Restul este configurat în cod și `.env`. Completează doar în browser:

## 1. Activează Google Sign-In

1. [Firebase Console → hostera24-f8585](https://console.firebase.google.com/project/hostera24-f8585/authentication/providers)
2. **Authentication** → **Sign-in method**
3. **Google** → **Enable** → Save

## 2. Adaugă SHA-1 (debug, pentru telefon/emulator)

1. [Project settings → Your apps → Android](https://console.firebase.google.com/project/hostera24-f8585/settings/general)
2. App `com.hostera24.hostera24` → **Add fingerprint**
3. SHA-1 debug (PC-ul tău):

```
23:F5:87:41:DB:D0:11:47:62:84:51:51:AD:64:CA:D0:D9:7B:EE:C6
```

## 3. (Opțional, producție) Service account

Pentru VPS, descarcă cheia JSON:

1. **Project settings** → **Service accounts** → **Generate new private key**
2. Salvează ca `firebase-service-account.json` la rădăcina proiectului
3. În `.env` decomentează:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json
```

Local merge și **fără** acest fișier (verificare token prin chei publice Google).
