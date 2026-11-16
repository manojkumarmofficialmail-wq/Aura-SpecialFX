import base64, subprocess
from playwright.sync_api import sync_playwright
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate','30','-c:v','mjpeg','-i','-','-c:v','libx264','-preset','veryfast','-crf','16','-pix_fmt','yuv420p','video_noaudio.mp4'],stdin=subprocess.PIPE)
with sync_playwright() as p:
    b=p.chromium.launch(args=["--allow-file-access-from-files"])
    pg=b.new_page(viewport={'width':1920,'height':1080})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(__import__('pathlib').Path(__file__).with_name('reel.html').resolve().as_uri());pg.evaluate('ready')
    for f in range(450):
        d=pg.evaluate(f"(renderTo({f}),document.getElementById('c').toDataURL('image/jpeg',.95))")
        ff.stdin.write(base64.b64decode(d.split(',')[1]))
    print('errors',errs)
    b.close()
ff.stdin.close();ff.wait()
