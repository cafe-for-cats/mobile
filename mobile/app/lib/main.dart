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
    final response = await http.get('http://localhost:3000/pins').catchError((err) => throw err);

    List<Pin> pins = parse(response.body);

    setState(() {
      _markers.clear();
      for (final pin in pins) {
        final marker = Marker(
          markerId: MarkerId(pin.label),
          position: LatLng(pin.latitude, pin.longitude),
          infoWindow: InfoWindow(
            title: pin.label,
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
          title: const Text('Protest Item Location Pinger'),
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
                      'Add a Pin',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                      ),
                    ),
                  ),
                  ListTile(
                    leading: Icon(Icons.message),
                  title: Text('Water'),
                    onTap: () { awaitPost('Water'); },
                  ),
                  ListTile(
                    leading: Icon(Icons.account_circle),
                    title: Text('Medic'),
                    onTap: () { awaitPost('Medic'); },

                  ),
                  ListTile(
                    leading: Icon(Icons.settings),
                    title: Text('Masks'),
                    onTap: () { awaitPost('Masks'); },

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
      ),
    );
  }
}

Future<void> awaitPost(String input) async {
  var url ='http://localhost:3000/pins';

  var data = {
    'userId': 123,
    'longitude': 38.92,
    'latitude':  -90.82,
    'label': input.toString(),
    'createDate': "2020-02-06"
  };

  var body = json.encode(data);

  var response = await http.post(url,
      headers: {"Content-Type": "application/json"},
      body: body
  );
  print("${response.statusCode}");
  print("${response.body}");

  return response;
}

class Pin {
  Pin({this.id, this.label, this.longitude, this.latitude});

  final String id;
  final String label;
  final double longitude;
  final double latitude;

  factory Pin.fromJson(Map<String, dynamic> json) {
    return Pin(
      id: json['PIN_ID'],
      label: json['LABEL'],
      longitude: json['LONGITUDE'],
      latitude: json['LATITUDE'],
    );
  }
}