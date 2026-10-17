import 'package:flutter/material.dart';
import 'screens/dashboard_screen.dart';
import 'screens/motorcycle_list_screen.dart';
import 'screens/expenditure_summary_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MotorcycleServiceLogApp());
}

class MotorcycleServiceLogApp extends StatelessWidget {
  const MotorcycleServiceLogApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Motorcycle Service Log',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A), // Plain dark slate
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFEA580C), // Solid orange
          secondary: Color(0xFF38BDF8),
          surface: Color(0xFF1E293B),
          background: Color(0xFF0F172A),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF1E293B),
          elevation: 0,
          foregroundColor: Colors.white,
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({Key? key}) : super(key: key);

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    DashboardScreen(),
    MotorcycleListScreen(),
    ExpenditureSummaryScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        backgroundColor: const Color(0xFF1E293B),
        indicatorColor: const Color(0xFFEA580C),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: Colors.white),
            label: 'Overview',
          ),
          NavigationDestination(
            icon: Icon(Icons.two_wheeler_outlined),
            selectedIcon: Icon(Icons.two_wheeler, color: Colors.white),
            label: 'Motorcycles',
          ),
          NavigationDestination(
            icon: Icon(Icons.receipt_long_outlined),
            selectedIcon: Icon(Icons.receipt_long, color: Colors.white),
            label: 'Expenses',
          ),
        ],
      ),
    );
  }
}
