import 'package:flutter/material.dart';
import 'package:hostera24/models/qr_entry.dart';
import 'package:hostera24/models/qr_schedule.dart';
import 'package:hostera24/models/qr_scan.dart';
import 'package:hostera24/theme/app_colors.dart';
import 'package:hostera24/utils/datetime_format.dart';

class QrEntryCard extends StatelessWidget {
  const QrEntryCard({
    super.key,
    required this.entry,
    required this.onTap,
    required this.onEdit,
    required this.onDelete,
  });

  final QrEntry entry;
  final VoidCallback onTap;
  final VoidCallback onEdit;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final time = formatDateTimeLocal(entry.createdAt);

    final firma = entry.firmaDescription?.trim();
    final client = entry.clientDescription?.trim();
    final pret = entry.pretRedus?.trim();

    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 8, 16),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppColors.accent.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.qr_code, color: AppColors.accent),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            entry.cod,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              color: AppColors.accent,
                              fontSize: 13,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.accent.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            scanariCountLabelWithLimit(
                              entry.numarScanari,
                              entry.limitaScanari,
                            ),
                            style: const TextStyle(
                              color: AppColors.accent,
                              fontWeight: FontWeight.w600,
                              fontSize: 11,
                            ),
                          ),
                        ),
                      ],
                    ),
                    if (pret != null && pret.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        pret,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          color: AppColors.accent,
                          fontSize: 13,
                        ),
                      ),
                    ],
                    if (firma != null && firma.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        firma,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          height: 1.3,
                        ),
                      ),
                    ],
                    if (client != null && client.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Text(
                        client,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                        ),
                      ),
                    ],
                    if ((firma == null || firma.isEmpty) &&
                        (client == null || client.isEmpty) &&
                        (pret == null || pret.isEmpty)) ...[
                      const SizedBox(height: 4),
                      const Text(
                        'Fără descrieri',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                          fontStyle: FontStyle.italic,
                        ),
                      ),
                    ],
                    if (entry.hasScanLimit) ...[
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(
                            entry.isLimitReached
                                ? Icons.block_outlined
                                : Icons.people_outline,
                            size: 14,
                            color: entry.isLimitReached
                                ? AppColors.error
                                : AppColors.accent,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              entry.isLimitReached
                                  ? 'Limită atinsă (${entry.limitaScanari} scanări)'
                                  : 'Limită: ${entry.numarScanari} / ${entry.limitaScanari} scanări',
                              style: TextStyle(
                                fontSize: 12,
                                color: entry.isLimitReached
                                    ? AppColors.error
                                    : AppColors.textSecondary,
                                height: 1.25,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                    if (entry.schedule.mode != QrScheduleMode.none) ...[
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(
                            entry.isScannableNow
                                ? Icons.event_available_outlined
                                : Icons.event_busy_outlined,
                            size: 14,
                            color: entry.isScannableNow
                                ? AppColors.accent
                                : AppColors.textSecondary,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              entry.schedule.summaryLabel,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 12,
                                color: entry.isScannableNow
                                    ? AppColors.accent
                                    : AppColors.textSecondary,
                                height: 1.25,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                    const SizedBox(height: 6),
                    Text(
                      time,
                      style: TextStyle(
                        fontSize: 12,
                        color: AppColors.textSecondary.withValues(alpha: 0.8),
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                tooltip: 'Editează',
                icon: const Icon(Icons.edit_outlined, color: AppColors.textSecondary),
                onPressed: onEdit,
              ),
              IconButton(
                tooltip: 'Șterge',
                icon: const Icon(Icons.delete_outline, color: AppColors.textSecondary),
                onPressed: onDelete,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
