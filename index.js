const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require ('tweakpane');

const settings = {
  dimensions: 'A0',
  orientation: 'landscape',
  // pixelsPerInch: 300,
  units: 'mm',
  animate: true
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 33,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "#d4cabe";
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width * 0.9;
    const gridh = height * 0.9;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.7;
      const h = cellh * 0.7;

      const f = params.animate ? frame : params.frame;

      // const n = random.noise2D(x + frame * 20, y, params.freq);
      const n = random.noise3D(x, y, f * 10, params.freq);


      const angle = n * Math.PI * params.amp;

      // const scale = (n + 1) / 2 * 30;
      // const scale = (n * 0.5 + 0.5) * 30;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.strokeStyle = '#86815b';
      context.stroke();

      context.restore();
    }

  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid'});
  folder.addInput(params, 'lineCap', { options: { regular: 'butt', round: 'round', square: 'square' }});
  folder.addInput(params, 'cols', { min: 2, max: 39 , step: 1 });
  folder.addInput(params, 'rows', { min: 2, max: 51, step: 1 });
  folder.addInput(params, 'scaleMin', { min: 0.5, max: 33 });
  folder.addInput(params, 'scaleMax', { min: 0.5, max: 33 });

  folder = pane.addFolder( { title: 'Noise' });
  folder.addInput(params, 'freq', { min: -0.005, max: 0.005 });
  folder.addInput(params, 'amp', { min: 0, max: 0.4 });
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', { min: 0, max: 215 });
};

createPane();

canvasSketch(sketch, settings);
