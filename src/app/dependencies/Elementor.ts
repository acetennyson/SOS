export function notify(param: {title: string, message: string, type?: 'danger'|'warning'|'info'|'success'|'secondary', duration?: number, options?: {text: string, class: 'string', cb: Function}[]}, windows?: Window) {
  windows = windows || window;
  param.type = param.type || 'info';

  const mainDiv = windows.document.createElement('div'),
  containerDiv = windows.document.createElement('div'),
  absoluteDIv = windows.document.createElement('div'),
  innerDiv = windows.document.createElement('div'),
  phead = windows.document.createElement('p'),
  h2 = windows.document.createElement('h2'),
  p2 = windows.document.createElement('p'),
  button = windows.document.createElement('button'),
  duration = (param.duration?param.duration:5000) - 800;

  phead.textContent = 'Alert Management'; phead.className = "font-sans antialiased text-base font-semibold text-stone-200";
  h2.innerHTML = param.title; h2.className = "font-sans antialiased font-bold text-xl md:text-2xl lg:text-3xl text-white my-3";
  p2.innerHTML = param.message; p2.className = "font-sans antialiased text-base mb-6 text-stone-200";
  button.textContent = 'Close'; button.className = "inline-flex items-center border font-sans font-medium text-center duration-300 ease-in focus:shadow-none text-sm py-2 px-4 shadow-sm hover:shadow-md bg-stone-800 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-white rounded-lg hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgbwindows.document.createElement(255,255,255,0.25),inset_0_-2px_0px_rgbwindows.document.createElement(0,0,0,0.35)] after:pointer-events-none transition antialiased";
  button.addEventListener('click', ()=>{
    mainDiv.remove();
  })

  mainDiv.classList.add('smooth');
  innerDiv.append(phead, h2, p2, button); innerDiv.className = "w-full h-max rounded py-8 px-10 relative z-10"
  /* absoluteDIv.appendChild(innerDiv); */ absoluteDIv.className = "absolute inset-0 bg-black/60 rounded-xl";
  containerDiv.append(absoluteDIv, innerDiv); containerDiv.className = "w-full border shadow-sm bg-white border-stone-200 shadow-stone-950/5 bg-[url('https://media.istockphoto.com/id/1322052316/photo/lack-of-space-interior-design-mistake.jpg?s=612x612&w=0&k=20&c=fZxPP34HOilg3FfLKj6A1JbUmDXqGJpJ6wPUUBqzGmU=')] rounded-xl bg-cover bg-no-repeat bg-right-top relative";
  mainDiv.appendChild(containerDiv);
  windows.document.body.append(mainDiv);

  setTimeout(()=>{
    mainDiv.classList.replace("show-bar", "hide-bar");
    setTimeout(()=>{
        mainDiv.remove()
    }, 1000);
  }, duration);
  return mainDiv;




  {
    /* <div class="w-full border shadow-sm overflow-hidden bg-white border-stone-200 shadow-stone-950/5 bg-[url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/david-ui/img/image-1.jpg')] rounded-xl bg-cover bg-no-repeat bg-right-top relative">
      <div class="absolute inset-0 bg-black/60 rounded-xl"></div>
      <div class="w-full h-max rounded py-8 px-10 relative z-10">
        <p class="font-sans antialiased text-base font-semibold text-stone-200">Upcoming Events</p>
        <h2 class="font-sans antialiased font-bold text-xl md:text-2xl lg:text-3xl text-white my-3">Tech Summit: Shaping Tomorrow</h2>
        <p class="font-sans antialiased text-base mb-6 text-stone-200">Prepare to be part of dynamic conversations that will redefine the boundaries.</p>
        <button class="inline-flex items-center border font-sans font-medium text-center duration-300 ease-in focus:shadow-none text-sm py-2 px-4 shadow-sm hover:shadow-md bg-stone-800 relative bg-gradient-to-b from-stone-700 to-stone-800 border-stone-900 text-white rounded-lg hover:bg-gradient-to-b hover:from-stone-800 hover:to-stone-800 hover:border-stone-900 after:absolute after:inset-0 after:rounded-[inherit] after:box-shadow after:shadow-[inset_0_1px_0px_rgbwindows.document.createElement(255,255,255,0.25),inset_0_-2px_0px_rgbwindows.document.createElement(0,0,0,0.35)] after:pointer-events-none transition antialiased">Join Now</button>
      </div>
    </div> */

    // https://media.istockphoto.com/id/1322052316/photo/lack-of-space-interior-design-mistake.jpg?s=612x612&w=0&k=20&c=fZxPP34HOilg3FfLKj6A1JbUmDXqGJpJ6wPUUBqzGmU=
    // https://raw.githubusercontent.com/creativetimofficial/public-assets/master/david-ui/img/image-1.jpg
  }
}
