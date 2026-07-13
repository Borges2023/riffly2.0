import os
from lameenc import Encoder

names = [
    'ultima-saudade.mp3',
    'xonei.mp3',
    'paredoes.mp3',
    'amigo-minha-saudade.mp3',
    'seja-ex.mp3',
    'de-tras-pra-frente.mp3',
    'aquela-pessoa.mp3',
    'meu-amor.mp3',
    'como-fica.mp3',
    'romantico.mp3',
    'oh-garota.mp3',
    'barbie.mp3',
    'do-job.mp3',
    'danada-ligando.mp3',
    '2025.mp3',
    'como-ta.mp3',
    'box-medley.mp3',
    'boy-besta.mp3',
    'vida-artista.mp3',
    'mo-fita.mp3',
]

audio_dir = os.path.join(os.getcwd(), 'front-end', 'public', 'audio')
encoder = Encoder()
encoder.set_bit_rate(128)
encoder.set_in_sample_rate(44100)
encoder.set_channels(1)
encoder.set_quality(2)

samples = bytes([0] * 44100 * 2)
encoded = encoder.encode(samples) + encoder.flush()

os.makedirs(audio_dir, exist_ok=True)
for name in names:
    path = os.path.join(audio_dir, name)
    with open(path, 'wb') as f:
        f.write(encoded)
    print('CREATED', name)
