import 'package:flutter/material.dart';
import 'package:hostera24/screens/profile_screen.dart';
import 'package:hostera24/screens/qr_creator_screen.dart';
import 'package:hostera24/screens/scan_qr_screen.dart';
import 'package:hostera24/widgets/offline_banner.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key, required this.email});

  final String email;

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  static const _titles = ['Scanare coduri', 'Codurile mele', 'Profil firmă'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_titles[_index]),
      ),
      body: Column(
        children: [
          const OfflineBanner(),
          Expanded(
            child: IndexedStack(
              index: _index,
              children: [
                ScanQrScreen(key: const ValueKey('scan')),
                const QrCreatorScreen(key: ValueKey('creator')),
                ProfileScreen(
                  key: const ValueKey('profile'),
                  email: widget.email,
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.qr_code_scanner_outlined),
            selectedIcon: Icon(Icons.qr_code_scanner),
            label: 'Scanare',
          ),
          NavigationDestination(
            icon: Icon(Icons.qr_code_2_outlined),
            selectedIcon: Icon(Icons.qr_code_2),
            label: 'Codurile mele',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            selectedIcon: Icon(Icons.person),
            label: 'Profil',
          ),
        ],
      ),
    );
  }
}
