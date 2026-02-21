window.onload = () => {
    // Elements
    const img_container = document.querySelector('.img-container');
    const song_img_el = document.getElementById('song-image');
    const song_title_el = document.getElementById('song-title');
    const artist_name_el = document.getElementById('artist-name');
    const song_next_el = document.getElementById('next-up');
    const audio_player = document.getElementById('music-player');
    
    // Controls
    const play_btn = document.getElementById('play-btn');
    const play_btn_icon = document.getElementById('play-icon');
    const prev_btn = document.getElementById('skip-prev');
    const next_btn = document.getElementById('skip-next');
    
    // New Controls
    const shuffle_btn = document.getElementById('shuffle-btn');
    const repeat_btn = document.getElementById('repeat-btn');
    const repeat_icon = document.getElementById('repeat-icon');
    const progress_bar = document.getElementById('progress-bar');
    const current_time_el = document.getElementById('current-time');
    const duration_el = document.getElementById('duration');
    const volume_slider = document.getElementById('volume-slider');
    const mute_btn = document.getElementById('mute-btn');
    const volume_icon = document.getElementById('volume-icon');

    let songs = [
        { title: 'Hacking to the Gate', artist: 'Kanako Itou', song_path: 'src/hacking to the gate.mp3', img_path: 'src/hacking to the gate.jpg' },
        { title: 'Gate of Steiner (Vocals)', artist: 'Eri Sasaki', song_path: 'src/gate of steiner (vocals).mp3', img_path: 'src/gate of steiner (vocals).jpg' },
        { title: 'Cosmic Looper', artist: 'Kanako Itou', song_path: 'src/cosmic looper.mp3', img_path: 'src/cosmic looper.jpg' },
        { title: 'Gate of Steiner (Re-awake)', artist: 'Takeshi Abo', song_path: 'src/re-awake.mp3', img_path: 'src/re-awake.jpg' },
        { title: 'Gate of Steiner (Piano)', artist: 'Takeshi Abo', song_path: 'src/gate of steiner (piano).mp3', img_path: 'src/gate of steiner (piano).jpg' },
        { title: 'Hacking to the Gate (Eng)', artist: 'JubyPhonic', song_path: 'src/hacking to the gate (eng).mp3', img_path: 'src/hacking to the gate (eng).jpg' },
        { title: 'Fatima', artist: 'Kanako Itou', song_path: 'src/sg 0 opening.mp3', img_path: 'src/sg 0 opening.jpg' },
        { title: 'Gate of Steiner', artist: 'Takeshi Abo', song_path: 'src/gate of steiner.mp3', img_path: 'src/gate of steiner.png' },
        { title: 'Amadeus', artist: 'Kanako Itou', song_path: 'src/amadeus.mp3', img_path: 'src/amadeus.jpg' },
        { title: 'Believe Me', artist: 'Takeshi Abo', song_path: 'src/believe me.mp3', img_path: 'src/believe me.jpg' },
        { title: 'Skyclad No Kansokusha', artist: 'Kanako Itou', song_path: 'src/Skyclad.mp3', img_path: 'src/Skyclad.jpg' },
        { title: 'Sad Mayuri', artist: 'Takeshi Abo', song_path: 'src/sadness.mp3', img_path: 'src/sadness.jpg' },
        { title: 'Itsumo Kono Basho de', artist: 'Ayane', song_path: 'src/reunion.mp3', img_path: 'src/reunion.jpg' },
        { title: 'Fatima (Eng)', artist: 'Amalee', song_path: 'src/sg 0 opening (eng).mp3', img_path: 'src/sg 0 opening (eng).jpg' },
        { title: 'Last Game', artist: 'Zwei', song_path: 'src/sg 0 ending.mp3', img_path: 'src/sg 0 ending.jpg' },
        { title: 'Anata No Eranda Kono Toki Wo', artist: 'Kanako Itou', song_path: 'src/movie opening.mp3', img_path: 'src/movie opening.png' },
        { title: 'Steins; Gate 0', artist: 'Asami Imai', song_path: 'src/sg 0 ending 2.mp3', img_path: 'src/sg 0 ending 2.png' },
        { title: 'Toki Tsukasadoru Juuni no Meiyaku', artist: 'Yui Sakakibara', song_path: 'src/sg ending.mp3', img_path: 'src/sg ending.jpg' },
        { title: 'Lyra', artist: 'Zwei', song_path: 'src/lyra.mp3', img_path: 'src/lyra.jpg' },
        { title: 'Another Heaven', artist: 'Kanako Itou', song_path: 'src/another heaven.mp3', img_path: 'src/another heaven.jpg' }
    ];

    let cur_song_ind = 0;
    let next_song_ind = 1;
    let isPlaying = false;
    let isShuffle = false;
    let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one

    // Event Listeners
    play_btn.addEventListener('click', togglePlayPause);
    next_btn.addEventListener('click', () => changeSong(true));
    prev_btn.addEventListener('click', () => changeSong(false));
    audio_player.addEventListener('ended', handleTrackEnd);
    
    audio_player.addEventListener('timeupdate', updateProgress);
    audio_player.addEventListener('loadedmetadata', updateDuration);
    progress_bar.addEventListener('input', setProgress);
    
    volume_slider.addEventListener('input', setVolume);
    mute_btn.addEventListener('click', toggleMute);
    
    shuffle_btn.addEventListener('click', toggleShuffle);
    repeat_btn.addEventListener('click', toggleRepeat);

    // Initialize
    InitPlayer();

    function InitPlayer() {
        audio_player.volume = volume_slider.value;
        UpdatePlayerContent();
    }

    function UpdatePlayerContent() {
        let song = songs[cur_song_ind];
        song_img_el.src = song.img_path;
        song_title_el.innerText = song.title;
        artist_name_el.innerText = song.artist || "Steins;Gate Series";
        song_next_el.innerText = songs[next_song_ind].title;
        audio_player.src = song.song_path;
        
        // Reset progress bar
        progress_bar.value = 0;
        current_time_el.innerText = "0:00";
        updateProgressBarColor(0);
        
        if (isPlaying) {
            audio_player.play();
        }
    }

    function togglePlayPause() {
        if (audio_player.paused) {
            audio_player.play();
            isPlaying = true;
            play_btn_icon.classList.remove('fa-play');
            play_btn_icon.classList.add('fa-pause');
            img_container.classList.add('playing');
        } else {
            audio_player.pause();
            isPlaying = false;
            play_btn_icon.classList.add('fa-play');
            play_btn_icon.classList.remove('fa-pause');
            img_container.classList.remove('playing');
        }
    }

    function changeSong(next = true) {
        if (isShuffle && next) {
            // Pick a random song that isn't the current one
            let rand_ind = Math.floor(Math.random() * songs.length);
            while (rand_ind === cur_song_ind && songs.length > 1) {
                rand_ind = Math.floor(Math.random() * songs.length);
            }
            cur_song_ind = rand_ind;
            next_song_ind = (cur_song_ind + 1) % songs.length;
        } else {
            if (next) {
                cur_song_ind = (cur_song_ind + 1) % songs.length;
            } else {
                cur_song_ind = (cur_song_ind - 1 + songs.length) % songs.length;
            }
            next_song_ind = (cur_song_ind + 1) % songs.length;
        }
        UpdatePlayerContent();
    }

    function handleTrackEnd() {
        if (repeatMode === 2) {
            // Repeat one
            audio_player.currentTime = 0;
            audio_player.play();
        } else if (repeatMode === 0 && cur_song_ind === songs.length - 1 && !isShuffle) {
            // No repeat and end of playlist
            isPlaying = false;
            play_btn_icon.classList.add('fa-play');
            play_btn_icon.classList.remove('fa-pause');
            img_container.classList.remove('playing');
            audio_player.currentTime = 0;
        } else {
            changeSong(true);
        }
    }

    // Format time from seconds to M:SS
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgress() {
        const { duration, currentTime } = audio_player;
        if (isNaN(duration)) return;
        
        const progressPercent = (currentTime / duration) * 100;
        progress_bar.value = progressPercent;
        current_time_el.innerText = formatTime(currentTime);
        updateProgressBarColor(progressPercent);
    }

    function updateDuration() {
        duration_el.innerText = formatTime(audio_player.duration);
    }

    function setProgress(e) {
        const width = 100; // max value of range input is 100
        const val = e.target.value;
        if (!isNaN(audio_player.duration)) {
            audio_player.currentTime = (val / width) * audio_player.duration;
            updateProgressBarColor(val);
        }
    }

    function updateProgressBarColor(percent) {
        progress_bar.style.background = `linear-gradient(to right, #e94560 ${percent}%, rgba(255, 255, 255, 0.2) ${percent}%)`;
    }

    function setVolume(e) {
        audio_player.volume = e.target.value;
        updateVolumeIcon();
    }

    function toggleMute() {
        if (audio_player.volume > 0) {
            volume_slider.setAttribute('data-prev', audio_player.volume);
            audio_player.volume = 0;
            volume_slider.value = 0;
        } else {
            const prev = volume_slider.getAttribute('data-prev') || 0.5;
            audio_player.volume = prev;
            volume_slider.value = prev;
        }
        updateVolumeIcon();
    }

    function updateVolumeIcon() {
        volume_icon.className = '';
        if (audio_player.volume === 0) {
            volume_icon.className = 'fas fa-volume-mute';
        } else if (audio_player.volume < 0.5) {
            volume_icon.className = 'fas fa-volume-down';
        } else {
            volume_icon.className = 'fas fa-volume-up';
        }
    }

    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffle_btn.classList.toggle('active');
    }

    function toggleRepeat() {
        repeatMode = (repeatMode + 1) % 3;
        repeat_icon.className = '';
        if (repeatMode === 0) {
            repeat_btn.classList.remove('active');
            repeat_icon.className = 'fas fa-redo';
        } else if (repeatMode === 1) {
            repeat_btn.classList.add('active');
            repeat_icon.className = 'fas fa-redo';
        } else if (repeatMode === 2) {
            repeat_btn.classList.add('active');
            // Using a hack for a generic "repeat one" icon look in free font awesome
            repeat_icon.className = 'fas fa-sync-alt'; 
            repeat_btn.title = "Repeat One";
        }
        
        if (repeatMode !== 2) {
            repeat_btn.title = "Repeat " + (repeatMode === 1 ? "All" : "");
        }
    }
} 