import 'package:flutter/material.dart';
import 'package:hostera24/services/network_service.dart';
import 'package:hostera24/services/sync_service.dart';
import 'package:hostera24/theme/app_colors.dart';

class OfflineBanner extends StatefulWidget {
  const OfflineBanner({super.key});

  @override
  State<OfflineBanner> createState() => _OfflineBannerState();
}

class _OfflineBannerState extends State<OfflineBanner> {
  bool _online = true;
  int _pendingScans = 0;

  @override
  void initState() {
    super.initState();
    _online = NetworkService.instance.isOnline;
    _loadPending();
    NetworkService.instance.onlineStream.listen((online) async {
      if (!mounted) return;
      setState(() => _online = online);
      if (online) {
        await SyncService.instance.syncPendingScans();
      }
      await _loadPending();
    });
  }

  Future<void> _loadPending() async {
    final count = await SyncService.instance.pendingScanCount();
    if (mounted) setState(() => _pendingScans = count);
  }

  @override
  Widget build(BuildContext context) {
    if (_online && _pendingScans == 0) {
      return const SizedBox.shrink();
    }

    final offline = !_online;

    return Material(
      color: offline
          ? AppColors.textSecondary.withValues(alpha: 0.12)
          : AppColors.accent.withValues(alpha: 0.12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            Icon(
              offline ? Icons.cloud_off_outlined : Icons.cloud_sync_outlined,
              size: 20,
              color: offline ? AppColors.textSecondary : AppColors.accent,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                offline
                    ? 'Offline — listă coduri din cache. '
                        'Creare/editare necesită internet.'
                    : 'Se sincronizează $_pendingScans scanări…',
                style: TextStyle(
                  fontSize: 13,
                  color: offline
                      ? AppColors.textSecondary
                      : AppColors.accent,
                  height: 1.3,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
