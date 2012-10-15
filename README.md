A2B - The Javascript Edition
============================

By Telecoda
-----------

I have been developing code for many years as a full time developer and hobbiest.

My career took me in the direction of corporate software, but I have always harboured a love of developing games too.  Behind me is a trail of half baked/half finished ideas for games/utitilies over the years.

I have normally found the best way to learn a technology or language is to dive in with a "real" project and not just follow the clinical examples presented in a book/online.

So here is A2B a 3D puzzle game written in javascript using:-

  threejs: https://github.com/mrdoob/three.js/ 

  physijs: http://chandlerprall.github.com/Physijs/ 

Installation
------------
All you need to do is download the code from here using 

    git clone git://github.com/telecoda/a2b.js.git

And that's it.
 

Running the code
----------------
The code needs to be hosted on a webserver to run.  Or you can use python to spin up a simple one.

    cd a2b.js
    
    python -mSimpleHTTPServer 9000

Point your browser to:-

    http://localhost:9000


Browser tips
------------
I have been developing and testing the code in Google Chrome on linux but is "should" run just as well on other browsers.

If your browser claims that it cannot run WebGL is may be worth forcing Chrome to ignore your blacklisted gpu drivers.

Try starting up chrome and passing the following parameters:-

    ./google-chrome --ignore-gpu-blacklist --flag-switches-begin --flag-switches-en