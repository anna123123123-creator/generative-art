(function () {
  'use strict';

  var PALETTES = {
    aurora: ['#19B8D4', '#3ED598', '#8B5CF6', '#5EEAD4'],
    sunset: ['#F59E0B', '#F87171', '#8B5CF6', '#FBBF24'],
    mono: ['#EAF0FA', '#93A0B8', '#495372', '#C7D2E3'],
    candy: ['#F472B6', '#60A5FA', '#FBBF24', '#34D399'],
  };

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  var paletteSelect = document.getElementById('paletteSelect');
  var densityInput = document.getElementById('densityInput');
  var lengthInput = document.getElementById('lengthInput');

  var seed = Math.random() * 1000;

  function fieldAngle(x, y) {
    return (
      Math.sin(x * 0.006 + seed) +
      Math.cos(y * 0.008 - seed * 1.3) +
      Math.sin((x + y) * 0.004 + seed * 0.7)
    ) * Math.PI;
  }

  function generate() {
    seed = Math.random() * 1000;
    var colors = PALETTES[paletteSelect.value];
    var count = parseInt(densityInput.value, 10);
    var steps = parseInt(lengthInput.value, 10);

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#050810';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';

    for (var p = 0; p < count; p++) {
      var x = Math.random() * W;
      var y = Math.random() * H;
      var color = colors[Math.floor(Math.random() * colors.length)];
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1 + Math.random() * 1.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (var s = 0; s < steps; s++) {
        var a = fieldAngle(x, y);
        x += Math.cos(a) * 2.2;
        y += Math.sin(a) * 2.2;
        if (x < 0 || x > W || y < 0 || y > H) break;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  document.getElementById('btnGenerate').addEventListener('click', generate);
  document.getElementById('btnExport').addEventListener('click', function () {
    canvas.toBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'generative-art.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
  });

  generate();
})();
