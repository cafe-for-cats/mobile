import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

void main() {
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final Map<String, Marker> _markers = {};
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();

  List<Pin> parse(String responseBody) {
    final parsed = json.decode(responseBody).cast<Map<String, dynamic>>();

    return parsed.map<Pin>((json) => Pin.fromJson(json)).toList();
  }

  Future<void> _onMapCreated(GoogleMapController controller) async {
    const googleLocationsURL = 'http://localhost:3000/pins';

    // Retrieve the locations of Google offices
    final response = await http.get(googleLocationsURL);

    List<Pin> pins = parse(response.body);

//    if (response.statusCode == 200) {
////      return Locations.fromJson(json.decode(response.body));
////    } else {
////      throw HttpException(
////          'Unexpected status code ${response.statusCode}:'
////              ' ${response.reasonPhrase}',
////          uri: Uri.parse(googleLocationsURL));
////    }'


    setState(() {
      _markers.clear();
      for (final pin in pins) {
        final marker = Marker(
          markerId: MarkerId(pin.label),
          position: LatLng(pin.latitude, pin.longitude),
          infoWindow: InfoWindow(
            title: pin.label,
//            snippet: office.address,
          ),
        );
        _markers[pin.label] = marker;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: const Text('Google Office Locations'),
          backgroundColor: Colors.green[700],
        ),
        drawer: Builder(builder: (context) =>
            Drawer(
              child: ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                  DrawerHeader(
                    decoration: BoxDecoration(
                      color: Colors.blue,
                    ),
                    child: Text(
                      'Drawer Header',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                      ),
                    ),
                  ),
                  ListTile(
                    leading: Icon(Icons.message),
                  title: Text('Add a Pin'),
                    onTap: () { Navigator.pop(context); },
                  ),
                  ListTile(
                    leading: Icon(Icons.account_circle),
                    title: Text('Profile'),
                  ),
                  ListTile(
                    leading: Icon(Icons.settings),
                    title: Text('Settings'),
                  ),
                ],
              ),
            ),
        ),
        body: GoogleMap(
          onMapCreated: _onMapCreated,
          myLocationEnabled: false,
          zoomGesturesEnabled: true,
          myLocationButtonEnabled: false,
          initialCameraPosition: CameraPosition(
            target: const LatLng(0, 0),
            zoom: 2,
          ),
          markers: _markers.values.toSet(),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            onPressed: () => _scaffoldKey.currentState.openDrawer();
          },
          child: Icon(Icons.control_point),
          backgroundColor: Colors.green,
        ),
      ),
    );
  }
}

class Pin {
  final String id;
  final String label;
  final double longitude;
  final double latitude;

  Pin({this.id, this.label, this.longitude, this.latitude});

  factory Pin.fromJson(Map<String, dynamic> json) {
    return Pin(
      id: json['PIN_ID'],
      label: json['LABEL'],
      longitude: json['LONGITUDE'],
      latitude: json['LATITUDE'],
    );
  }
}