# Nerdzork Genesis Craft

This is a simple website that hosts a form application that allows you to
create/modify the JSON format for NerdZork puzzles.

## Installation

It is a simple front-end application and doesn't need any build steps.

## Serving

To use this website, serve it with a normal front-end server layer, like
apache or nginx. Or you can run it with a local tool like one of the following:

### http-server (npm)

Install http-server

```
npm install --global http-server
```

Run it

```
$ http-server
Starting up http-server, serving ./
Available on:
  http://127.0.0.1:8081
  http://192.168.0.13:8081
Hit CTRL-C to stop the server
```

### PHP dev server

If you have php installed on your machine, run a local php server like so:

```
$ php -S 127.0.0.1:8000
[Mon Aug 17 19:58:38 2020] PHP 7.4.8 Development Server (http://127.0.0.1:8000) started
```

### Python

If you have python installed on your machine, run a local python server like so:

```
$ python3 -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

## Usage

Once loaded in a browser, the web application will present you with a form. You
can paste in some JSON code from nerdzork puzzle json definition and press the
button "Load JSON." It will populate the form below with all the puzzle
details, room and doodad data. You can tweak the values, add rooms and doodads,
etc. Then you can export the json again and save that to disk to submit it to
the nerdzork API webservice.

You can also start from scratch and make a new puzzle with the form and export
it as a puzzle json file.
