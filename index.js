let dataLagu = [];
let urutan = 0;

let splash = document.getElementById("splash");
let audio = document.getElementById("audio");
let source = document.getElementById("source");
let cover = document.getElementById("cover");
let title = document.getElementById("title");
let artist = document.getElementById("artist");
let cover2 = document.getElementById("cover2");
let title2 = document.getElementById("title2");
let artist2 = document.getElementById("artist2");
let main = document.getElementById("main");
let search = document.getElementById("search");
let find = document.getElementById("find");
let bg = document.getElementById("bg");
let volume = document.getElementById("volume");
let playPauseBtn = document.getElementById("playPauseBtn");
let backBtn = document.getElementById("backBtn");
let nextBtn = document.getElementById("nextBtn");

setTimeout(() => {
  splash.style = "display: none";
}, 3000);

let tampil = (val) => {
  if (val === 0) {
    main.style = "display: block";
    detail.style = "display: none";
  } else if (val === 1) {
    main.style = "display: none";
    detail.style = "display: block";
  }
};

let renderLagu = (tracks) => {
  tracks.forEach((track) => {
    let list = `
        <div id="${track.id}" class="row" onclick="playTrack(
          '${track.artwork["150x150"]}',
          '${track.title}',
          '${track.user.name}',
          '${track.id}')">
        <img src="${track.artwork["150x150"]}" alt="gambar" />
        <div>
        <p>${track.title}</p>
        <p>${track.user.name}</p>
        </div>
        </div>
        `;

    main.innerHTML += list;
  });
};

let ambilLagu = async () => {
  try {
    let res = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/trending`
    );

    let data = await res.json();

    if (data && data.data && data.data.length > 0) {
      dataLagu = [...dataLagu, ...data.data];
      renderLagu(data.data);
    }

    let first = dataLagu[0];

    bg.src = first.artwork["150x150"];
    cover2.src = first.artwork["150x150"];
    title2.innerHTML = first.title;
    artist2.innerHTML = first.user.name;

    cover.src = first.artwork["150x150"];
    title.innerHTML = first.title;
    artist.innerHTML = first.user.name;

    let stream = `https://discoveryprovider.audius.co/v1/tracks/${first.id}/stream`;

    source.src = stream;
    audio.load();
  } catch (error) {
    console.log(error.message);
  }
};

let playTrack = (a, b, c, d) => {
  let stream = `https://discoveryprovider.audius.co/v1/tracks/${d}/stream`;

  source.src = stream;
  audio.load();
  audio.play();

  cover.src = a;
  title.innerHTML = b;
  artist.innerHTML = c;
  cover2.src = a;
  title2.innerHTML = b;
  artist2.innerHTML = c;
  bg.src = a;

  urutan = dataLagu.findIndex((track) => track.id === d);
};

ambilLagu();

let aturVlm = () => {
  audio.volume = volume.value;
};

volume.addEventListener("input", aturVlm);

let playPause = () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
};

audio.onplaying = () => {
  playPauseBtn.innerText = "Jeda";
};

audio.onpause = () => {
  playPauseBtn.innerText = "Main";
};

playPauseBtn.addEventListener("click", playPause);

let nextPlay = () => {
  urutan = (urutan + 1) % dataLagu.length;
  let track = dataLagu[urutan];
  playTrack(track.artwork["150x150"], track.title, track.user.name, track.id);
};

let backPlay = () => {
  urutan = (urutan - 1 + dataLagu.length) % dataLagu.length;
  let track = dataLagu[urutan];
  playTrack(track.artwork["150x150"], track.title, track.user.name, track.id);
};

nextBtn.addEventListener("click", nextPlay);

backBtn.addEventListener("click", backPlay);

audio.onended = nextPlay;

let cariLagu = async () => {
  let res = "";

  let query = search.value || find.value;
  query = query.toString().toLowerCase();

  if (query !== "") {
    res = await fetch(
      `https://discoveryprovider.audius.co/v1/tracks/search?query=${query}`
    );
  } else {
    res = await fetch(`https://discoveryprovider.audius.co/v1/tracks/trending`);
  }

  let data = await res.json();

  if (data && data.data && data.data.length > 0) {
    dataLagu = [...dataLagu, ...data.data];
    renderLagu(data.data);
  }

  let filter = dataLagu.filter(
    (track) =>
      track.title.toLowerCase().includes(query) ||
      track.user.name.toLowerCase().includes(query)
  );

  main.innerHTML = "";
  renderLagu(filter);
};

let cariGanti = () => {
  cariLagu();
  main.style = "display: block";
  detail.style = "display: none";
};

search.addEventListener("input", () => {
  cariLagu();
});

find.addEventListener("input", () => {
  cariGanti();
});
