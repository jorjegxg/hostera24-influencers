import 'package:flutter/material.dart';
import 'package:hostera24/screens/angajat_profile_screen.dart';
import 'package:hostera24/screens/profile_screen.dart';
import 'package:hostera24/screens/qr_creator_screen.dart';
import 'package:hostera24/screens/scan_qr_screen.dart';
import 'package:hostera24/services/auth_service.dart';
import 'package:hostera24/widgets/offline_banner.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({super.key, required this.session});

  final AuthSession session;

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int _index = 0;

  bool get _isAngajat => widget.session.isAngajat;

  List<String> get _titles => _isAngajat
      ? const ['Scanare coduri', 'Profil angajat']
      : const ['Scanare coduri', 'Codurile mele', 'Profil firmă'];

  @override
  Widget build(BuildContext context) {
    final pages = _isAngajat
        ? <Widget>[
            ScanQrScreen(key: const ValueKey('scan')),
            AngajatProfileScreen(
              key: const ValueKey('angajat-profile'),
              session: widget.session,
            ),
          ]
        : <Widget>[
            ScanQrScreen(key: const ValueKey('scan')),
            const QrCreatorScreen(key: ValueKey('creator')),
            ProfileScreen(
              key: const ValueKey('profile'),
              email: widget.session.email,
            ),
          ];

    final destinations = _isAngajat
        ? const [
            NavigationDestination(
              icon: Icon(Icons.qr_code_scanner_outlined),
              selectedIcon: Icon(Icons.qr_code_scanner),
              label: 'Scanare',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline),
              selectedIcon: Icon(Icons.person),
              label: 'Profil',
            ),
          ]
        : const [
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
          ];

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
              children: pages,
            ),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: (i) => setState(() => _index = i),
        destinations: destinations,
      ),
    );
  }
}
