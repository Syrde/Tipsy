# Tipsy

Alkuperäinen Tipzy-hahmo, luotu imagegen-työkalulla 7.10.2026. Läpinäkyvä 1536 × 1024 PNG sisältää kuusi 512 × 512 poseerausta. Selain animoi poseja, asentoa ja puhetilaa. Tämä on kuvista animoitu hahmo, ei reaaliaikainen 3D-malli tai varsinainen huulisynkka.

Generointikehote: Original premium 3D cartoon male Finnish host “Tipsy”; dark swept hair with silver streak, expressive brows, crooked friendly nose, neat stubble, rosy cheeks, midnight plum dinner jacket, teal satin lapels, loose gold tie, cream shirt, retro silver microphone. Sarcastic comedian; not existing Buzz likeness. Transparent 3x2 sprite sheet, six chest-up states neutral, speaking, laughing, facepalm, pointing, smug. No text.

Ääni: fi-FI-HarriNeural, synteettinen suomenkielinen puhe. Repliikit ovat pelille kirjoitettuja. Tunnusäänet syntyvät selaimen omista oskillaattoreista.


## Tipsyn lisäeleet
Built-in image_gen, alkuperäinen tipsy-sprites.png hahmoreferenssinä. Tiedosto tipsy-mischief.png, 3 × 2 ruutua: keskisormi, kieli ja ristisilmä, epäusko, silmänisku ja sormipistooli, nauru, voitontanssi. Kehote: sama ruskeahiuksinen, harmaaraitainen aikuinen 3D-sarjakuvajuontaja, violetti puku, petrolinväriset kaulukset, kultainen solmio, mikrofoni; kuusi tasakokoista vyötäröstä ylöspäin kuvattua elettä, ei tekstiä. Pyydetty läpinäkyvyys ei toteutunut; studiosävytteinen tausta vastaa alkuperäistä sheettiä.

## Tipsyn juomiseleitä
Built-in image_gen, sama alkuperäinen Tipsy referenssinä. tipsy-drinking.png: 2 × 2 ruutua, pullosta hörppiminen, suun pyyhkiminen, horjuminen ja koominen kaatuminen. Kehote: sama aikuinen 3D-sarjakuvajuontaja pukuineen ja mikrofoneineen, neljä tasaista ruutua studiosävyisellä taustalla, ei vammoja, ei tekstiä. Lorina on projektin oma synteettinen ääniefekti (scripts/compose-glug.py), ei lainattu äänite.

## Pelaajien uudet satunnaishahmot

Built-in image_gen. Tipsyn alkuperäinen tipsy-sprites.png on kuvitustyylin referenssi; pelaajahahmot ovat uusia identiteettejä. contestants-0.png ja contestants-1.png sisältävät kumpikin 10 hahmoriviä ja neljä elettä rivillä: neutraali, voitto/nauru, kieli ja keskisormi, tappio/facepalm. Studio on tummansininen, hahmot ovat aikuisia ja vaatetettuja. Ei valmiita nimiä tai tekstiä kuvissa. Kuvien rivikohtainen rajaus määritellään quiz-avatars.js:ssä, alkuperäisiä kuvia ei muokata.

Kehotejoukko: polished expressive 3D cartoon material style matching the Tipsy reference; four columns and ten rows; each row one distinct adult pub-party contestant repeated in idle cheeky smile, outrageous happy victory, rude tongue-out middle finger, embarrassed facepalm; same identity and clothes across the row; waist-up, big expressive facial features; dark navy background, no text, no nudity, no overlaps. Sheet 0 identities: leopard bathrobe mustache man, glitter green dress red-haired woman, purple mohawk rocker, pink-haired neon fur woman, portly gold-chain shirt man, silver-haired feather-boa woman, blond disco mullet man, tattooed sailor woman, yellow-raincoat bucket-hat man, gothic black-bob woman. Sheet 1 identities: blonde tiara pink tracksuit woman, thin curled-mustache magenta-tuxedo man, dark-haired red-beret leopard-blazer woman, ginger braided-beard biker, orange-haired aviator turquoise-jumpsuit woman, black-haired red-disco-shirt man, elderly spiky-haired silver-leather punk woman, pink-shirt cowboy man, violet-ponytail holographic-bomber woman, bearded zebra-jacket bow-tie man. Ten different new identities per sheet, no duplicate characters.

## Maajussi (kuva 2, hahmo 5 / ID 4)

farmer-sprites.png korvaa kultaketjuisen miehen vain tämän hahmon kohdalla. Built-in image_gen 7.10.2026, contestants-0.png tyylireferenssinä. Neljä poseerausta yhdellä rivillä: neutraali, voitto, kieli ja keskisormi, facepalm. Kehote: same polished 3D cartoon game style, adult burly Finnish farmer, thick mustache, ruddy cheeks, scruffy hair, worn brown cap, red checked flannel, denim overalls, straw in mouth; consistent identity across four equal columns, dark navy background, no text. Alkuperäinen: C:/Users/miika/.codex/generated_images/01a1134d-4ff1-72b1-8e00-53e137668c4c/exec-237cd2c0-a1aa-4b5c-a257-7eded156903a.png.

## Hahmojen äänet

20 erillistä PixVerse Eleven v3 -presettiä, kaksi onnistumis- ja kaksi epäonnistumisrepliikkiä hahmoa kohden. Tekstit: public/avatar-lines.js. Presetit ja palvelun generointitulokset: scripts/avatar-voice-presets.json ja public/audio/avatars-v1/*.result.json. Aktiiviset tiedostot ja kestot: public/audio/manifest.json, avatars. Maajussin puhe on kirjoitettu murteella. Suomen ääntäminen riippuu monikielisestä äänimallista.

Rokkarin epäonnistumisen metallisointu on oma synteettinen 2 sekunnin riffi, scripts/compose-rocker-sting.py → public/audio/rocker-sad-metal.wav.
