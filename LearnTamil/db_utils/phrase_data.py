import os
import sys
import numpy
import shutil
import librosa
import subprocess
import noisereduce
import pyloudnorm
import warnings

from os import path
from scipy.io import wavfile
from pydub import AudioSegment
from pydub.utils import mediainfo

sys.path.append(path.abspath(path.join(path.dirname(__file__), '..', '..')))
from py_utils.utils import log, load_json, save_json

CURRENT_DIR = path.dirname(__file__)
ASSETS_DIR = path.abspath(path.join(CURRENT_DIR, '..', 'assets'))
AUDIO_ASSETS_DIR = path.join(ASSETS_DIR, 'audio', 'phrase')
DATA_FILE = path.join(ASSETS_DIR, 'data.json')
ALPHABET_FILE = path.join(ASSETS_DIR, 'alphabet.json')
TMP_DIR = path.abspath(path.join(CURRENT_DIR, 'tmp'))

class Phrase:
    @staticmethod
    def from_mp3(phrase_id, file_path):
        tags = get_tags(file_path)
        return Phrase.from_tags(phrase_id, tags)

    @staticmethod
    def from_tags(phrase_id, tags):
        return Phrase(phrase_id, tags['original'], tags['translation'], tags['category_id'], tags.get('script'))

    @staticmethod
    def from_dict(phrase):
        return Phrase(phrase['id'], phrase['original'], phrase['translation'], phrase['categoryId'], phrase.get('script'))

    @staticmethod
    def from_str(phrase_str):
        _split = phrase_str.split(':')
        phrase_id = int(_split[0])
        category_id = int(_split[1])

        _split = _split[2].split('->')
        original = _split[0].strip()

        _split = _split[1].split('|')
        translation = _split[0].strip()

        script = None
        if len(_split) > 1:
            script = _split[1].strip()
            
        return Phrase(phrase_id, original, translation, category_id, script)
        
    def __init__(self, phrase_id, original, translation, category_id, script=None):
        self.id = phrase_id
        self.original = original
        self.translation = translation
        self.script = script
        self.category_id = int(category_id)

    @property
    def dict(self):
        out = {
            'id': self.id,
            'original': self.original,
            'translation': self.translation,
            'categoryId': self.category_id,
        }
        if self.script:
            out['script'] = self.script

        return out

    @property
    def tags(self):
        out = {
            'original': self.original,
            'translation': self.translation,
            'category_id': self.category_id,
        }

        if self.script:
            out['script'] = self.script

        return out

    @property
    def file_path(self):
        return path.join(AUDIO_ASSETS_DIR, f'phrase_{self.id}.mp3')

    def save_mp3(self, audio_file=None):
        audio_file = audio_file or self.file_path
        clip = AudioSegment.from_mp3(audio_file)
        log.info(f'Exporting {self.file_path}...')
        handler = clip.export(self.file_path, format='mp3', tags=self.tags)
        handler.close()

    def __str__(self):
        script = f' | {self.script}' if self.script else ''
        return f"{self.id}:{self.category_id}: {self.original} -> {self.translation}{script}"


class Category:
    def __init__(self, category_id, name, icon):
        self.id = category_id
        self.name = name
        self.icon = icon

    @property
    def dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'icon': self.icon,
        }


class Letter:
    def __init__(self, letter, vowel, consonant):
        self.letter = letter
        self.vowel = vowel
        self.consonant = consonant

    def dict(self):
        return {
            'letter': self.letter,
            'vowel': self.vowel,
            'consonant': self.consonant,
        }

    def __str__(self):
        return f"{self.consonant}-{self.vowel}: {self.letter}"


class SuppressWarnings:
    def __init__(self, modules):
        self.modules = modules

    def __enter__(self):
        for module in self.modules:
            warnings.filterwarnings('ignore', module=module)

    def __exit__(self, *args):
        warnings.resetwarnings()


CATEGORIES = [
    Category(1, 'Greetings', 'handshake'),
    Category(2, 'Family', 'baby'),
    Category(3, 'Simple Words', 'book'),
    Category(4, 'Q & A', 'question'),
    Category(5, 'Numbers', 'sort-numeric-up'),
    Category(6, 'Daily Activities', 'coffee'),
    Category(7, 'Food & Cooking', 'utensils'),
    Category(8, 'Travel & Directions', 'plane'),
    Category(9, 'School & Work', 'graduation-cap'),
    Category(10, 'Body Parts', 'lungs'),
    Category(11, 'Animals', 'paw'),
    Category(12, 'Feelings', 'heart'),
]


def audio_to_array(segment):
    samples = segment.get_array_of_samples()
    return numpy.array(samples)


def loop_phrases(audio_dir=AUDIO_ASSETS_DIR, strip_text='phrase_'):
    items = []
    for filename in os.listdir(audio_dir):
        if filename.startswith(strip_text) and filename.endswith('mp3'):
            phrase_id = filename.replace('.mp3', '').replace(strip_text, '')
            try:
                phrase_id = int(phrase_id)
            except ValueError:
                pass
            file_path = path.join(audio_dir, filename)
            items.append((file_path, phrase_id))
    return sorted(items, key=lambda x: x[1])
            


def create_tmp_dir():
    if not path.exists(TMP_DIR):
        os.mkdir(TMP_DIR)


def cleanup():
    if path.exists(TMP_DIR):
        shutil.rmtree(TMP_DIR)


def get_tags(file_path):
    mp3_media = mediainfo(file_path)
    if 'TAG' not in mp3_media:
        raise ValueError("MP3 does not have tags defined, cannot instantiate Phrase.")
    return mp3_media['TAG']


def sort_phrases(phrases):
    """Orders phrases alphabetically by their original text."""

    def _sort_phrase(phrase):
        original = phrase['original']
        try:  # Phrase numbers specified numerically for ordering purposes
            int_val = int(original)
            return str(int_val).zfill(4)
        except ValueError:
            return original

    new_phrases = {}
    for category_id, phrase_set in phrases.items():
        new_phrases[category_id] = sorted(phrase_set, key=_sort_phrase)
    return new_phrases


def check_missing_data():
    data = load_json(DATA_FILE)

    phrase_ids = []
    for _category_id, phrase_set in data['phrases'].items():
        for phrase in phrase_set:
            phrase_ids.append(phrase['id'])

    phrase_ids = sorted(phrase_ids)
    i = 1
    for j in phrase_ids:
        if i != j:
            raise ValueError((i, j))
        i += 1


def save_data(data, data_file):
    data['phrases'] = sort_phrases(data['phrases'])
    save_json(data, data_file)


def append_data(phrases=(), categories=(), data_file=DATA_FILE):
    if path.exists(data_file):
        data = load_json(data_file)
    else:
        data = {
            'categories': [],
            'phrases': {},
        }

    data['categories'] += list([c.dict for c in categories])
    for p in phrases:
        cat_id = str(p.category_id)
        data['phrases'][cat_id] = data['phrases'].get(cat_id, [])
        data['phrases'][cat_id].append(p.dict)

    save_data(data, data_file)


def update_data(phrases=(), categories=(), data_file=DATA_FILE):
    def _update_items(new_items, old_items):
        for new_item in new_items:
            for old_item in old_items:
                if new_item.id == old_item['id']:
                    old_item.update(new_item.dict)

    if path.exists(data_file):
        data = load_json(data_file)

        _update_items(categories, data['categories'])
        cat_ids = {str(p.category_id) for p in phrases}
        for cat_id in cat_ids:
            _update_items(
                filter(lambda p: str(p.category_id) == cat_id, phrases),
                data['phrases'][cat_id],
            )
        save_data(data, data_file)
    else:
        append_data(phrases, categories, data_file)


def get_max_phrase_id():
    phrases = []
    for _, phrase_id in loop_phrases(AUDIO_ASSETS_DIR):
        phrases.append(phrase_id)

    phrases = sorted(phrases)
    sequence = list(range(1, len(phrases) + 1))

    for i, phrase_id in enumerate(phrases):
        if phrase_id != sequence[i]:
            raise Exception(f'Phrase {phrase_id} is missing.')
    return max(phrases)


def remove_phrase(phrase_id):
    """
    Used to delete a phrase from the library, whilst maintaining a consistent,
    consecutive id order.
    """
    log.info(f'Removing phrase {phrase_id}...')
    max_id = get_max_phrase_id()
    max_phrase_file = path.join(AUDIO_ASSETS_DIR, f'phrase_{max_id}.mp3')
    max_phrase = Phrase.from_mp3(max_id, max_phrase_file)

    # Update data file
    data = load_json(DATA_FILE)
    
    to_remove = None
    for category_id, phrase_set in data['phrases'].items():
        for i, phrase in enumerate(phrase_set):
            if phrase['id'] == phrase_id:
                to_remove = (category_id, i)
                break

    del data['phrases'][to_remove[0]][to_remove[1]]

    for i, phrase in enumerate(data['phrases'][str(max_phrase.category_id)]):
        if phrase['id'] == max_id:
            phrase['id'] = phrase_id
            break

    save_data(data, DATA_FILE)

    # Copy audio data
    max_phrase.id = phrase_id
    max_phrase.save_mp3(max_phrase_file)
    os.remove(max_phrase_file)

    check_missing_data()


def move_phrases(audio_files):
    phrase_num = get_max_phrase_id() + 1
    for file_path in audio_files:
        log.info(f'Moving {file_path}...')
        shutil.move(file_path, os.path.join(AUDIO_ASSETS_DIR, f'phrase_{phrase_num}.mp3'))
        phrase_num += 1


def audio_to_json(data_file=DATA_FILE):
    phrases = []
    for file_path, phrase_id in loop_phrases():
        phrase = Phrase.from_mp3(phrase_id, file_path)
        log.info(f'Processing Phrase {phrase_id}...')
        phrases.append(phrase)           

    phrases = sorted(phrases, key=lambda x: (x.category_id, x.id))
    append_data(phrases, data_file=data_file)


def add_phrases(phrase_metadata, audio_files):
    """
    Takes a list of tuples describing phrase metadata:

    (original, translation, category_id, script)

    And a list of file paths to the audio_files
    """

    phrase_id = get_max_phrase_id() + 1

    phrases = []
    for i, in_file_path in enumerate(audio_files):
        original, translation, category_id, script = phrase_metadata[i]
        phrase = Phrase(phrase_id, original, translation, category_id, script)
        phrase.save_mp3(in_file_path)
        phrases.append(phrase)
        phrase_id += 1

    append_data(phrases)

    # Clean up processed files
    for fpath in audio_files:
        os.remove(fpath)


def update_category(phrase_ids, new_category_id):
    phrases = []
    for file_path, phrase_id in loop_phrases():
        if phrase_id in phrase_ids:
            phrase = Phrase.from_mp3(phrase_id, file_path)
            phrase.category_id = new_category_id
            phrase.save_mp3(file_path)
            phrases.append(phrase)
    update_data(phrases)


def convert_audio(input_path, output_ext, sampling_rate=44100, bitrate=128):
    output_path = input_path[:-3] + output_ext
    log.info(f'Converting {input_path} to {output_path}...')

    opts = []
    if input_path[-3:] == 'mp3':
        opts += ['-vn', '-ar', str(sampling_rate), '-ac', '2', '-b:a', f'{bitrate}k']

    cmd = ['ffmpeg', '-i', input_path] + opts + [output_path, '-y']
    with open(os.devnull, 'w') as devnull:
        subprocess.call(cmd, stdout=devnull, stderr=subprocess.STDOUT)
    return output_path


def reduce_noise(
    phrase_file,
    noise_file=None,
    sampling_rate=44100,
    lufs=-14.0,
    bitrate=128,
):
    """
    Uses the noisereduce library to produce WAV files reducing the
    noise and normalising the volume to -14 LUFS
    """

    noise_file = noise_file or path.join(CURRENT_DIR, 'noise.wav')

    if phrase_file[-3:] != 'wav':
        phrase_file = convert_audio(phrase_file, 'wav', sampling_rate=sampling_rate)

    with SuppressWarnings(['librosa', 'audioread']):
        noise, _ = librosa.load(noise_file, sr=sampling_rate)
        phrase, _ = librosa.load(phrase_file, sr=sampling_rate)

    create_tmp_dir()

    log.info(f'Reducing noise...')
    reduced_noise = noisereduce.reduce_noise(
        audio_clip=phrase,
        noise_clip=noise,
        verbose=False,
    )

    log.info('Normalising loudness...')
    meter = pyloudnorm.Meter(sampling_rate)
    loudness = meter.integrated_loudness(reduced_noise)
    with SuppressWarnings(['pyloudnorm']):
        normalised_audio = pyloudnorm.normalize.loudness(reduced_noise, loudness, lufs)

    def _assign_ext(fpath, extension):
        return fpath[:len(fpath) - 4] + '.' + extension

    tmp_file = path.join(TMP_DIR, path.basename(phrase_file))
    tmp_mp3 = _assign_ext(tmp_file, 'mp3')
    tmp_wav = _assign_ext(tmp_file, 'wav')
    wavfile.write(tmp_wav, sampling_rate, normalised_audio)

    if os.path.exists(tmp_mp3):
        os.remove(tmp_mp3)

    convert_audio(tmp_wav, 'mp3', sampling_rate, bitrate)
    os.remove(tmp_wav)
    return tmp_mp3


def split_audio(
    mp3_path, threshold=500, start_clip=50, end_clip=750,
    output_prefix = 'clip-',
):
    """
    Uses a simple algorithm to split clips in an audio file based on 
    silence inbetween noise.
    """
    audio = AudioSegment.from_mp3(mp3_path)
    create_tmp_dir()

    clips = []
    clip_start = None
    clip_end = None
    consecutive = 0
    for i, x in enumerate(audio):
        if x.max > threshold:
            if not clip_start:
                consecutive += 1
            else:
                consecutive = 0
        else:
            if not clip_start:
                consecutive = 0
            else:
                consecutive += 1

        if not clip_start and consecutive > start_clip:            
            clip_start = max([0, i - 100])
            consecutive = 0
        elif clip_start and consecutive > end_clip:
            clip_end = max([clip_start, (i - end_clip) + 100])
            consecutive = 0
            clips.append((clip_start, clip_end))
            clip_start = None
            clip_end = None

    clip_paths = []
    for i, start_end in enumerate(clips):
        start, end = start_end
        clip = audio[start:end + 1]
        log.info(f'Exporting clip {i + 1}...')
        output_path = path.join(TMP_DIR, f'{output_prefix}{i + 1}.mp3')
        handler = clip.export(output_path, format='mp3')
        handler.close()
        clip_paths.append(output_path)
    return clip_paths


def assign_metadata(clips, phrases):
    assert len(clips) == len(phrases)

    for i, phrase in enumerate(phrases):
        log.info(f'Updating {phrase.file_path}...')
        phrase.save_mp3(clips[i])
        os.remove(clips[i])
    update_data(phrases)


def get_phrase_by_key(value, key='id'):
    data = load_json(DATA_FILE)
    for _, phrase_set in data['phrases'].items():
        for phrase in phrase_set:
            if phrase[key] == value:
                return Phrase.from_dict(phrase)


def get_next_phrases(n=50):
    phrase_data = load_json(DATA_FILE)
    phrases = []
    for _, phrase_set in phrase_data['phrases'].items():
        for _phrase in phrase_set:
            if len(phrases) < n and 'script' not in _phrase:
                phrase = Phrase.from_dict(_phrase)
                phrases.append(phrase)
    return phrases


def main():
    pass


if __name__ == '__main__':
    main()
