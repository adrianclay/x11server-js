import {acceptConnection} from "./Connection";
import {_processRequest, _processPacket} from "./ProcessRequest";
import _GetProperty from "./GetProperty";
import _InternAtom from "./InternAtom";
import _PolyFillRectangle from "./PolyFillRectangle";
import _QueryColors from "./QueryColors";
import _GetInputFocus from "./GetInputFocus";
import _QueryExtension from "./QueryExtension";
import {_CreateWindow} from "./CreateWindow";
import _QueryPointer from "./QueryPointer";
import _PolyFillArc from "./PolyFillArc";
import _QueryFont from "./QueryFont";
import _OpenFont from "./OpenFont";
import _GetWindowAttributes from "./GetWindowAttributes";
import _GetGeometry from "./GetGeometry";
import _GetModifierMapping from "./GetModifierMapping";
import _GetKeyboardMapping from "./GetKeyboardMapping";
import _AllocColor from "./AllocColor";
import {_PolyLine} from "./PolyLine";
import _LookupColor from "./LookupColor";
import _PolyText8 from "./PolyText8";
import {_CreateGC} from "./CreateGC";
import {GraphicsContextCollection} from "./GraphicsContext";
import _CreatePixmap from "./CreatePixmap";
import {PixmapCollection} from "./Pixmap";
import _PutImage from "./PutImage";
import _ListFonts from "./ListFonts";
import _MapWindow from "./MapWindow";
import _ChangeWindowAttributes from "./ChangeWindowAttributes";
import _MapSubwindows from "./MapSubwindows";
import { objectTypeSpreadProperty } from "@babel/types";

function createCanvas() {
    const screen = document.createElement('canvas') ;
    screen.height = 600;
    screen.width = 700;
    screen.id = 'screen';
    document.body.appendChild(screen);
    // @ts-ignore
    screen.x = 0;
    // @ts-ignore
    screen.y = 0;
    return screen;
}

function Init() {
    const screen = createCanvas();
    const context = screen.getContext('2d');
    const atoms = [];
    const windows = {
        2: {
            parentWindowId: 0,
            visualId: 7,
            x: 0,
            y: 0,
            width: 700,
            height: 600,
            borderWidth: 0,
            windowAttributes: {},
        },
    };
    const fonts = [];
    const graphicsContexts: GraphicsContextCollection = [];
    const pixmaps: PixmapCollection = [];

    const protocolHandlers = {
        1: _CreateWindow(windows),
        2: _ChangeWindowAttributes(windows),
        3: _GetWindowAttributes(windows),
        8: _MapWindow(windows),
        9: _MapSubwindows(windows),
        14: _GetGeometry(windows),
        16: _InternAtom(atoms),
        20: _GetProperty(),
        38: _QueryPointer(screen),
        43: _GetInputFocus(),
        45: _OpenFont(fonts),
        47: _QueryFont(fonts),
        49: _ListFonts(),
        53: _CreatePixmap(pixmaps),
        55: _CreateGC(graphicsContexts),
        65: _PolyLine(windows, context),
        70: _PolyFillRectangle(context),
        71: _PolyFillArc(context),
        72: _PutImage(windows, pixmaps),
        74: _PolyText8(context, graphicsContexts, windows),
        84: _AllocColor(),
        91: _QueryColors(),
        92: _LookupColor(),
        98: _QueryExtension(),
        101: _GetKeyboardMapping(),
        119: _GetModifierMapping(),
    };

    const processRequest = _processRequest(protocolHandlers);

    const processPacket = _processPacket(processRequest);
    const ws = new WebSocket('ws://localhost:8080');
    let acceptedConnection = false;
    ws.onmessage = (ev: MessageEvent<Blob>) => ev.data.arrayBuffer().then(buffer => {
        const dataView = new DataView(buffer);
        if(!acceptedConnection) {
            acceptedConnection = true;
            acceptConnection(dataView, ws);
        } else {
            processPacket(dataView, ws);
        }
    });


    screen.addEventListener('mousemove', e => {
        // @ts-ignore
        screen.x = e.offsetX;
        // @ts-ignore
        screen.y = e.offsetY;
    });

    screen.addEventListener('focusin', e => {
        const byteArray = new ArrayBuffer(32);
        const sendDataView = new DataView(byteArray);
        sendDataView.setUint8(0, 9);
        sendDataView.setUint8(1, 5);
        sendDataView.setUint16(2, 343, true);
        sendDataView.setUint32(4, 13, true);
        ws.send(byteArray);
        console.log('FOCUS IN', windows);
    });

    const filterWindowByParent = (parentWindowId: number) => Object.entries(windows).filter(([_, window]) => window.parentWindowId == parentWindowId);
    function windowsAsTree(parentWindowId: number) {
        return {
            window: windows[parentWindowId],
            children: filterWindowByParent(parentWindowId)
        }
    }

    screen.addEventListener('mousedown', ({ offsetX, offsetY }) => {
        const possibleWindows = Object.entries(windows).filter(([windowId, window]) => (
            offsetX >= window.x && offsetX <= window.x + window.width &&
            offsetY >= window.y && offsetY <= window.y + window.height
        ));
        console.log(windowsAsTree(2));
    })
}

window.addEventListener('load', Init);
