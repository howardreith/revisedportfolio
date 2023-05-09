const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const mediaKeyMap = {
  suddenlySeymour: {
    filename: 'Suddenly Seymour',
    title: 'Suddenly Seymour',
    musical: 'Little Shop of Horrors',
    publishYear: '1982',
    recordedDate: '05/08/2023'
  },
  inEveryAge: {
    filename: 'In Every Age',
    title: 'In Every Age',
    musical: 'Titanic',
    publishYear: '1997',
    recordedDate: '05/07/2023'
  },
  // whyGodWhy: {
  //   filename: 'Why God Why',
  //   title: 'Why God? Why?',
  //   musical: 'Miss Saigon',
  //   publishYear: '1989',
  //   recordedDate: '05/07/2023'
  // },
  someEnchantedEvening: {
    filename: 'Some Enchanted Evening',
    title: 'Some Enchanted Evening',
    musical: 'South Pacific',
    publishYear: '1949',
    recordedDate: '05/01/2023'
  },
  allIAskOfYou: {
    filename: 'All I ask of you with gloria',
    title: "All I Ask of You",
    musical: 'The Phantom of the Opera',
    publishYear: '1986',
    recordedDate: '04/21/2023',
    comment: 'Thank you to Gloria for giving me permission to sing with her video. Her Youtube channel is https://www.youtube.com/@SingwithGloria'
  },
  dangerousGame: {
    filename: 'Dangerous Game with Maisie',
    title: 'Dangerous Game',
    musical: 'Jekyll and Hyde',
    publishYear: '1997',
    recordedDate: '04/09/2023',
    comment: 'Thank you to Maisie for giving me permission to sing with her video. Her Youtube channel is https://www.youtube.com/@maisiewaller'
  },
  dancingThroughLife: {
    filename: 'Dancing through life',
    title: 'Dancing Through Life',
    musical: 'Wicked',
    publishYear: '2003',
    recordedDate: '04/02/2023'
  },
  myTimeOfDay: {
    filename: 'My Time of Day',
    title: 'My Time of Day',
    musical: 'Guys and Dolls',
    publishYear: '1950',
    recordedDate: '03/27/2023'
  },
  pilatesDream: {
    filename: 'Pilates Dream',
    title: "Pilate's Dream",
    musical: 'Jesus Christ Superstar',
    publishYear: '1971',
    recordedDate: '03/25/2023'
  },
}

function buildTable() {
  const tableBody = document.getElementById('tableBody')
  Object.keys(mediaKeyMap).forEach((song) => {
    const tr = document.createElement('tr');
    tableBody.appendChild(tr)
    const musicalCell = document.createElement('td');
    musicalCell.innerHTML = `${mediaKeyMap[song].musical} (${mediaKeyMap[song].publishYear})`
    tr.appendChild(musicalCell)
    const titleCell = document.createElement('td');
    titleCell.innerHTML = `${mediaKeyMap[song].title}`
    tr.appendChild(titleCell)
    const recordedOnCell = document.createElement('td');
    recordedOnCell.innerHTML = `${mediaKeyMap[song].recordedDate}`
    tr.appendChild(recordedOnCell)
    const buttonCell = document.createElement('td');
    tr.appendChild(buttonCell)
    const button = document.createElement('button')
    button.id = `${song}Button`
    button.innerHTML = 'Load'
    button.className = 'button button-3d button-black button-small'
    buttonCell.appendChild(button)
  })
}
buildTable()

const videoContainer = document.getElementById('videoContainer')

function setVideo(videoKey) {
  if (document.getElementById('video')) {
    document.getElementById('video').remove()
  }
  if (document.getElementById('video')) {
    document.getElementById('video').remove()
  }
  const video = document.createElement('video');
  video.setAttribute('id', 'video');
  video.setAttribute('width', '80%');
  video.setAttribute('controls', 'true');
  videoContainer.appendChild(video)

  const title = document.getElementById('videoTitle');
  title.innerHTML = mediaKeyMap[videoKey].title;
  const musical = document.getElementById('videoMusical');
  musical.innerHTML = `From ${mediaKeyMap[videoKey].musical} (${mediaKeyMap[videoKey].publishYear})`;
  const recordedOn = document.getElementById('videoRecordedOn');
  recordedOn.innerHTML = `Recorded on ${mediaKeyMap[videoKey].recordedDate}`
  const comment = document.getElementById('videoComment');
  comment.innerHTML = `${mediaKeyMap[videoKey].comment || ''}`

  const source = document.createElement('source');
  source.setAttribute('src', `https://d6nbb7ifyxnlf.cloudfront.net/${mediaKeyMap[videoKey].filename}.mp4`);
  source.setAttribute('type', 'video/mp4');
  source.setAttribute('id', 'videoSource')
  video.appendChild(source);
}

setVideo(params.selected_song || Object.keys(mediaKeyMap)[0])

function handleChooseSongClick(e) {
  document.getElementById('videoSource').remove()
  setVideo(e.target.id.slice(0, -6))
}

Object.keys(mediaKeyMap).forEach((key) => {
  document.querySelector(`#${key}Button`)
    .addEventListener("click", handleChooseSongClick)
})
