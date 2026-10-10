# privacy-email-profile-image

[English](README.md) | Deutsch | [Français](README.fr.md)

Ein E-Mail-Badge für dein GitHub-Profil-README, das deine Adresse als Bild statt als Text zeigt und dich zu einer frischen Adresse wechseln lässt, sobald die alte Spam anzieht.

<p align="center">
  <img src="https://readmes.pages.dev/email/caption-email/ears" alt="Demo: ein E-Mail-Badge mit Fuchsohren, als Bild gezeichnet">
</p>
<p align="center">
  <img src="https://readmes.pages.dev/email/card/caption-contact" alt="Demo: dasselbe Badge im Kartenstil mit der Beschriftung Contact">
</p>

Die Adressen in der Demo oben sind erfunden. Lade die Seite neu und schau genau hin: Die Buchstaben sitzen jedes Mal auf leicht unterschiedlicher Höhe, weil das Badge bei jeder Anfrage neu gezeichnet wird.

Stichwörter: E-Mail-Badge, GitHub-Profil-README, E-Mail vor Scrapern verbergen, E-Mail als Bild, Anti-Spam, Wegwerf-E-Mail, temporäre E-Mail, E-Mail-Alias, Datenschutz, Kontakt-Badge, SVG-Badge, Cloudflare Pages Functions, Serverless, E-Mail-Adresse wechseln, Spamschutz.

## Warum eine E-Mail-Adresse als Bild

Eine E-Mail-Adresse im Klartext in ein öffentliches README zu schreiben, ist eine offene Einladung. Crawler lesen GitHub ständig, und eine als Text geschriebene Adresse landet innerhalb weniger Tage auf Spamlisten. Die üblichen Ausweichlösungen sind umständlich. „name at example dot com“ nervt genau die Menschen, von denen du hören willst, und bremst einen modernen Scraper kaum.

Dieses Badge geht einen anderen Weg. Die Adresse wird auf dem Server in eine kleine Bitmap gezeichnet und als Pixel in ein SVG gelegt. Der SVG-Quelltext enthält überhaupt keinen Adresstext, sodass Werkzeuge, die den Seitenquelltext nach etwas Adressähnlichem durchsuchen, nichts finden. Menschen lesen die Adresse trotzdem auf einen Blick und können sie in ihr Mailprogramm tippen.

Ein Bild ist kein Tresor. Texterkennung (OCR) kann Pixel lesen, und ein Mensch kann eine Adresse immer von Hand abschreiben. Deshalb ist das Badge um eine zweite Idee herum gebaut, die wichtiger ist als die erste.

## Wechseln, sobald sie leakt

Eine Adresse zu verstecken, verzögert nur den Moment, in dem sie leakt. Deshalb habe ich mir einen anderen Ansatz ausgedacht. Ich nenne ihn das Modell „swap as it leaks“ (wechseln, sobald sie leakt): Akzeptiere, dass jede öffentliche Adresse irgendwann leakt, und mach das Ersetzen mühelos.

Statt eine einzige Adresse für immer geheim halten zu wollen, führst du eine Liste von Adressen. Meist sind das Wegwerf- oder Alias-Adressen eines Weiterleitungsdienstes, aber jede Adresse funktioniert. Das Badge zeigt eine davon. Sobald diese Adresse Spam bekommt, öffnest du einen geheimen Link, und das Badge springt zur nächsten Adresse in deiner Liste. Den geleakten Alias legst du danach in deinem Maildienst still oder löschst ihn.

Jedes Profil, jede Website und jedes Dokument, das das Badge einbindet, aktualisiert sich automatisch, weil alle auf dieselbe Bild-URL zeigen. In deinem README gibt es nichts zu ändern und nichts zu committen. Alte Kopien der Adresse, die Spammer gesammelt haben, funktionieren nicht mehr, sobald du diesen Alias abschaltest.

So wird ein Adressleck von einem dauerhaften Problem zu einer Routineaufgabe, die ein paar Sekunden dauert.

## Schnellstart mit der Demo

Du kannst das Badge sofort in deinem eigenen README sehen, wenn du diese Zeile einfügst:

```markdown
![Email address](https://readmes.pages.dev/email/caption-email)
```

Die Demo zeigt immer nur erfundene Adressen. Sie eignet sich also zum Ausprobieren von Stilen, nicht für echte Kontaktdaten. Um deine eigenen Adressen anzuzeigen, betreibe deine eigene Kopie. Der Abschnitt „Eigene Instanz einrichten“ weiter unten führt dich durch die Schritte, die auf einem kostenlosen Cloudflare-Konto etwa zehn Minuten dauern.

Einen URL-Baukasten mit Live-Vorschau gibt es unter [readmes.pages.dev/email/help](https://readmes.pages.dev/email/help).

## Optionen

Optionen sind Pfadsegmente nach `/email/`, in beliebiger Reihenfolge. Ein angehängtes `.svg` ist erlaubt, und Groß- und Kleinschreibung spielt keine Rolle. Wenn du eine Option falsch schreibst, wird das Badge zu einem kleinen rosa Hinweis, der die Position der unbekannten Option nennt, sodass Tippfehler leicht auffallen.

### Stil

| Option | Wirkung |
|---|---|
| `pill` | Abgerundete Pille (Standard) |
| `card` | Karte, mit der Beschriftung in einer eigenen Zeile über der Adresse |
| `plain` | Kein Hintergrund, nur Symbol und Adresse |
| `caption-email`, `caption-contact`, `caption-mail-me` | Beschriftung „Email“, „Contact“ oder „Mail me“ |
| `noicon` | Briefumschlag-Symbol ausblenden |
| `ears` | Kleine Fuchsohren oben auf dem Badge |

### Größe und Farbe

| Option | Wirkung |
|---|---|
| `size-N`, `size-Nrem` | Schriftgröße in Pixeln, 10 bis 40 (Standard 16) |
| `px` | Exakte Pixel statt rem (siehe unten) |
| `border-N` | Rahmenbreite in Pixeln, 0 bis 8 (Standard 0) |
| `accent-RRGGBB` | Farbe von Symbol, Beschriftung und Rahmen als Hexwert ohne `#` |
| `auto` | Folgt der hellen oder dunklen Einstellung des Betrachters (Standard) |
| `light`, `dark` | Ein Farbschema erzwingen |
| `transparent` | Kein Hintergrund, wenn es keine Beschriftung und keinen Rahmen gibt |
| `warm` | Warme readmes-Farbpalette statt GitHubs eigener Textfarben (Standard) |

### Schutz vor Scrapern

| Option | Wirkung |
|---|---|
| `jitter-N` | Zufälliger Versatz pro Buchstabe, 0 bis 3 (Standard 1) |
| `noise-N` | Schwache zufällige Sprenkel, 0 bis 3 (Standard 1) |

Jitter und Rauschen ändern sich bei jeder Anfrage. In der Standardstufe fallen sie dem Auge kaum auf, aber sie sorgen dafür, dass keine zwei Kopien des Bildes identisch sind. Das vereitelt einfachen Bildabgleich und macht automatisches Lesen etwas unzuverlässiger. Höhere Stufen wirken handgezeichneter. Stufe 0 schaltet den jeweiligen Effekt ab, wenn du ein ganz sauberes Bild bevorzugst.

Die Textfarbe folgt immer dem Farbschema. Im Auto-Modus ist die Adresse auf hellem Hintergrund dunkel und auf dunklem Hintergrund hell, passend zum GitHub-Design des jeweiligen Betrachters.

### Größen in rem

Jedes Badge wird in rem bemessen, wobei 1rem 16 Pixeln entspricht. Mit den Standardeinstellungen des Browsers sieht es genau wie eine Pixelgröße aus. Hat ein Leser die Standardschriftgröße seines Browsers erhöht, oft um Text leichter lesen zu können, wachsen Badge und Adresse mit, genau wie der Text darum herum. Du kannst Größen auch direkt in rem angeben, etwa `size-1.5rem`. Füge `px` hinzu, wenn ein Badge eine exakte Pixelgröße behalten muss.

## So funktioniert das Wechseln

Jede Instanz hat eine Liste von Adressen und ein geheimes Wechsel-Token, beide als verschlüsselte Cloudflare-Secrets gespeichert. Ein winziger Key-Value-Speicher merkt sich, welche Adresse gerade aktiv ist, und sonst nichts.

Der Aufruf von `/email/swap/<token>` springt zur nächsten Adresse der Liste und nach der letzten wieder zur ersten. `/email/swap/<token>/<n>` springt direkt zur Adresse Nummer n, gezählt ab 1. `/email/status/<token>` zeigt, welche Adresse aktiv ist, ohne etwas zu ändern.

Die Antworten sind kurze Textmeldungen wie „ok, showing address 3 of 12“. Sie enthalten eine teilweise maskierte Fassung der Adresse, etwa `m****-l******-q***@protonmail.com`, damit du den Wechsel bestätigen kannst, ohne dass die vollständige Adresse in deinem Browserverlauf landet.

Ein falsches Token bekommt genau dasselbe „404 Not Found“ wie jede nicht existierende Seite. Von außen lässt sich nicht erkennen, ob eine Instanz das Wechseln überhaupt aktiviert hat. Tokens mit weniger als 32 Zeichen werden grundsätzlich abgelehnt, und die Prüfung dauert gleich lang, egal wie nah ein Rateversuch liegt.

Das Badge selbst wird ohne Caching ausgeliefert, sodass GitHubs Bild-Proxy bei jedem Profilaufruf eine frische Kopie anfordert. Nach einem Wechsel erscheint die neue Adresse innerhalb etwa einer Minute überall.

## Eigene Instanz einrichten

Du brauchst ein kostenloses Cloudflare-Konto, Node.js 20 oder neuer und `make`. Ein `npm install` gibt es nicht, weil das Projekt keine Abhängigkeiten hat. Wrangler, das Kommandozeilenwerkzeug von Cloudflare, läuft bei der ersten Verwendung über `npx`.

### 1. Eigene Kopie anlegen

Klicke auf GitHub auf „Use this template“ und dann auf „Create a new repository“. Ein privates Repository funktioniert problemlos. Klone es auf deinen Rechner.

Trage in `site.config.json` deinen eigenen Namen und den Link zu deinem Repository ein. Diese Angaben erscheinen in der Fußzeile der Hilfeseite und im Copyright-Kommentar des Badges.

### 2. Pages-Projekt und Zustandsspeicher anlegen

```sh
npx wrangler pages project create my-badges --production-branch production
npx wrangler kv namespace create email-state
```

Der zweite Befehl gibt eine ID aus. Kopiere `wrangler.toml.example` nach `wrangler.toml` und trage deinen Projektnamen und diese ID ein. Die echte `wrangler.toml` steht in `.gitignore` und bleibt daher auf deinem Rechner.

### 3. Adressen speichern

Schreib deine Adressen in eine Textdatei außerhalb des Repositorys, eine pro Zeile. Speichere sie dann als verschlüsseltes Secret:

```sh
npx wrangler pages secret put EMAILS --project-name my-badges < ~/private/emails.txt
```

Kommas, Semikolons und Leerzeichen funktionieren ebenfalls als Trenner. Duplikate werden entfernt, und alles, was nicht wie eine gültige Adresse aussieht, wird ignoriert. Die Statusseite zeigt, wie viele Einträge übersprungen wurden.

### 4. Wechsel-Token erzeugen

Erzeuge ein langes Zufalls-Token und speichere es ebenfalls als Secret:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
npx wrangler pages secret put EMAIL_SWAP_TOKEN --project-name my-badges
```

Bewahre das Token sicher auf, zum Beispiel in deinem Passwortmanager. Wer es besitzt, kann ändern, welche Adresse dein Badge zeigt, sieht aber nicht die vollständige Adressliste.

### 5. Deployen und einbinden

```sh
make test
make deploy PROJECT=my-badges
```

Dein Badge ist jetzt unter `https://my-badges.pages.dev/email` erreichbar. Binde es mit einem allgemeinen Alternativtext in dein Profil-README ein, niemals mit der Adresse selbst:

```markdown
![Email address](https://my-badges.pages.dev/email/caption-email)
```

Öffne einmal `https://my-badges.pages.dev/email/status/<token>`, um zu prüfen, ob alles verbunden ist.

### Lokale Vorschau

Kopiere `.dev.vars.example` nach `.dev.vars`, passe die Datei an und führe `make dev` aus. Die Datei wird von Git ignoriert. Verwende dort nach Möglichkeit erfundene Adressen, damit echte nie in einem Projektordner liegen.

## Die Adressliste verwalten

### Wie viele Adressen passen hinein

Cloudflare begrenzt jede Umgebungsvariable und jedes Secret auf 5 KiB. Ein typischer Alias wie `maple-lantern-q7x2@protonmail.com` belegt mit Zeilenumbruch etwa 30 bis 35 Bytes, eine Variable fasst also ungefähr 150 bis 170 Adressen. Lange eigene Domains verringern diese Zahl.

Brauchst du mehr, füge `EMAILS_2`, `EMAILS_3` und so weiter bis `EMAILS_9` hinzu. Sie werden der Reihe nach gelesen und zu einer Liste zusammengefügt, was weit über tausend Adressen erlaubt. Die meisten werden nie mehr als eine Handvoll brauchen.

### Adressen auswählen

Alias- und Weiterleitungsdienste passen am besten. Viele Mailanbieter und Datenschutzwerkzeuge erzeugen mit einem Klick eine neue Weiterleitungsadresse, und wenn du sie später löschst, ist der Spam komplett abgeschnitten, ohne dein echtes Postfach zu berühren. Jede normale Adresse funktioniert ebenfalls, falls du lieber zwischen eigenen Postfächern rotierst.

Vor dem `@` dürfen Adressen Buchstaben, Ziffern, Punkte, Bindestriche, Unterstriche und Pluszeichen enthalten. Seltene Zeichen außerhalb dieser Menge können nicht gezeichnet werden. Einträge mit solchen Zeichen werden übersprungen und auf der Statusseite gezählt.

### Die Liste im laufenden Betrieb ändern

Du kannst das Secret `EMAILS` jederzeit ersetzen; deploye danach erneut, damit der neue Wert übernommen wird. Die aktive Position wird als Zahl gespeichert. Kürzt du die Liste, läuft die Zahl sicher herum. Ordnest du die Liste um, prüfe die Statusseite und wähle mit `/email/swap/<token>/<n>` die gewünschte Adresse.

Eine gute Routine ist, ein paar unbenutzte Aliasse am Ende der Liste bereitzuhalten. Leakt einer, wechselst du, legst den alten Alias still und hängst bei Gelegenheit einen frischen ans Ende.

## Mehrere Listen in einer Instanz

Ein einzelnes Pages-Projekt kann mehrere unabhängige Badges unter verschiedenen Pfaden ausliefern. So musst du nicht für jedes ein neues Projekt anlegen. Cloudflare begrenzt, wie viele Pages-Projekte ein Konto haben darf, daher ist das gut zu wissen.

Jedes zusätzliche Badge heißt Instanz. Es hat seine eigene Adressliste und sein eigenes Wechsel-Token und merkt sich seine eigene aktive Position. Seine Secrets tragen ein Präfix deiner Wahl, zum Beispiel `WORK_EMAILS` und `WORK_EMAIL_SWAP_TOKEN`. Um eine Instanz hinzuzufügen, lege neben `functions/email/` einen Routenordner an, der dieselben Handler mit diesem Präfix aufruft:

```js
// functions/email-work/[[params]].js
import { badge } from "../../src/email/handler.js";
export const onRequest = ({ request, env, params }) =>
  badge(request.method, env, [].concat(params.params ?? []), { prefix: "WORK_", key: "work" });
```

Lege in diesem Ordner passende Dateien `swap/[[params]].js` und `status/[[params]].js` an, die `swap` und `status` auf dieselbe Weise aufrufen. Das Token einer Instanz steuert nie eine andere, und die Positionen liegen unter getrennten Schlüsseln im selben Zustandsspeicher.

Eine Route, die nirgends verlinkt ist, ist kein Geheimnis, denn jeder, der dein Profil sieht, kann die Bildadresse lesen. Sie hält dein persönliches Badge lediglich aus der öffentlichen Übersicht heraus.

## Das Token schützen

Der Wechsel-Link ist eine normale Webadresse mit dem Token darin. Das ist bequem, hat aber ein paar Nebenwirkungen, die du kennen solltest.

Chat-Apps und manche Mailprogramme rufen Links automatisch ab, um eine Vorschau anzuzeigen. Fügst du deinen Wechsel-Link in einen Chat ein, löst schon dieser Vorschauabruf den Wechsel aus. Halte den Link aus Messengern heraus, oder nutze den Status-Link, wenn du nur nachsehen willst.

Browser merken sich besuchte Adressen. Wenn du einen Rechner mit anderen teilst, nutze ein privates Fenster oder ruf den Link stattdessen im Terminal auf:

```sh
curl https://my-badges.pages.dev/email/swap/<token>
```

Cloudflare kann für dein Konto Anfrageprotokolle führen, die den Pfad enthalten. Das ist zwar dein eigenes Konto, aber ein weiterer Ort, an dem das Token auftaucht. Wenn du vermutest, dass jemand anderes das Token gesehen hat, erzeuge ein neues und speichere es genau wie in Schritt 4 der Einrichtung. Das alte Token funktioniert sofort nicht mehr.

## Wovor es schützt

Das Badge soll billiges, massenhaftes Adressensammeln vereiteln. Crawler, die den Seitenquelltext lesen, `mailto:`-Links folgen oder Textmuster über HTML laufen lassen, finden nichts, weil es keinen Text zu finden gibt. Jede Antwort unterscheidet sich in den Pixeln, sodass auch einfacher Bildabgleich nicht hilft.

Es ist nicht dafür gedacht, einen Menschen aufzuhalten, der deine Adresse haben will, oder einen Scraper, der auf jedes Bild OCR anwendet. Das kann kein Bild leisten, denn was Menschen lesen können, kann auch eine Maschine lesen. Die eigentliche Verteidigung ist das Wechseln: Eine geleakte Adresse kostet dich ein paar Sekunden statt jahrelangen Spam.

Verwende dieses Badge für nichts, was vertraulich bleiben muss. Behandle jede Adresse in der Liste so, als könnte sie irgendwann öffentlich werden.

## Barrierefreiheit

Screenreader kündigen das Badge als „Email address, shown as an image“ an und können die Adresse selbst nicht vorlesen, denn wer sie assistiven Technologien zugänglich macht, macht sie auch Scrapern zugänglich. Wenn Barrierefreiheit für dein Publikum wichtig ist, biete neben dem Badge einen weiteren Kontaktweg an, etwa ein Kontaktformular oder ein Profil auf einer Plattform mit privaten Nachrichten.

Die Textfarbe folgt der hellen oder dunklen Einstellung des Betrachters. Der Kontrast erfüllt WCAG AA in beiden Farbschemata bei Standardgröße, und die Hilfeseiten unterstützen Tastaturbedienung und reduzierte Bewegung.

## Webseiten

Neben dem Badge liefert jede Instanz zwei kleine Seiten aus.

| Pfad | Inhalt |
|---|---|
| `/email/help` | Alle Optionen und ein URL-Baukasten mit Live-Vorschau |
| `/email/agents` | Markdown-Anleitung für KI-Agenten und Werkzeuge |

Sie enthalten Open-Graph-Tags und schema.org-JSON-LD, und Vorschau-Deployments werden automatisch als noindex markiert. Skripte sind über eine strikte Content Security Policy nur per Hash zugelassen.

### Projektaufbau

```
functions/email/           Pages Functions: Badge, Wechsel, Status, Hilfe, Agenten
src/email/                 Optionen, Rasterisierer, PNG-Encoder, SVG, Seiten
src/email/font.generated.js  Glyphen-Bitmaps (DejaVu Sans Mono Bold)
scripts/build.mjs          site.config.json -> src/email/site.generated.js
scripts/build-font.mjs     Glyphentabelle neu erzeugen (ImageMagick)
test/                      node:test-Unit-Tests
wrangler.toml.example      Vorlage für die KV-Bindung (nach wrangler.toml kopieren)
.dev.vars.example          Vorlage für lokale Secrets (nach .dev.vars kopieren)
```

Alles liegt unter einem `email`-Pfad, sodass dieses Projekt sich ein Pages-Projekt mit anderen Badge-Apps teilen kann, ohne dass Dateinamen kollidieren.

## Häufige Fragen

### Kann ich das Badge zu einem anklickbaren mailto-Link machen?

Du kannst es in einen Link einbetten, aber ein `mailto:`-Link bringt die Adresse als Text zurück in dein README und macht den Zweck zunichte. Die meisten Menschen schreiben die Adresse ohnehin ab.

### Warum nicht einfach ein Kontaktformular?

Formulare sind großartig und funktionieren gut neben diesem Badge. Manche Menschen bevorzugen aber schlicht E-Mail, und eine sichtbare Adresse ist immer noch der universellste Weg, erreichbar zu sein.

### Funktioniert es auch außerhalb von GitHub?

Ja. Überall, wo eine Bild-URL angezeigt werden kann, lässt sich auch das Badge zeigen, etwa auf persönlichen Websites, anderen Code-Hostern und in Forensignaturen.

### Wie schnell wirkt ein Wechsel?

Meist innerhalb einer Minute. Der Zustandsspeicher aktualisiert sich weltweit innerhalb von etwa sechzig Sekunden, und das Badge selbst wird nie zwischengespeichert.

### Brauche ich den Key-Value-Speicher?

Nur für das Wechseln per Link. Ohne ihn kannst du eine Variable `EMAIL_INDEX` (gezählt ab 1) setzen, um die Adresse zu wählen, und sie durch erneutes Deployen ändern. Das funktioniert, aber der Link ist viel schneller, wenn eine Adresse leakt.

### Kann die Demo meine Adresse zeigen?

Nein. Die Demo zeigt nur erfundene Adressen und nimmt keine Eingaben an. Deine echten Adressen gehören in eine Instanz, die du selbst kontrollierst.

## Fehlerbehebung

### Das Badge meldet „no address configured“

Die Instanz sieht keine gültige Adresse. Prüfe, dass das Secret genau `EMAILS` heißt und zu demselben Pages-Projekt gehört, in das du deployt hast. Secrets erreichen nur neue Deployments, deploye also nach dem Speichern oder Ändern noch einmal. Ist die Liste vorhanden, aber jeder Eintrag wird übersprungen, achte auf ungewöhnliche Zeichen rund um das `@`.

### Der Wechsel-Link liefert 404

Ein 404 bedeutet, dass das Token nicht passte, fehlte oder kürzer als 32 Zeichen ist. Kopiere das Token erneut aus deinem Passwortmanager und achte auf ein verirrtes Leerzeichen am Anfang oder Ende. Denk daran, dass das Secret `EMAIL_SWAP_TOKEN` heißen muss und wie jedes Secret erst nach einem neuen Deployment wirkt.

### Der Wechsel-Link liefert 503

Das Token ist richtig, aber die Instanz hat keinen Zustandsspeicher. Stelle sicher, dass deine `wrangler.toml` die Bindung `EMAIL_STATE` mit der ID deines Key-Value-Namespace enthält, und deploye erneut aus dem Ordner, in dem diese Datei liegt.

### Mein Profil zeigt noch die alte Adresse

Warte zuerst eine Minute, denn der Zustandsspeicher braucht bis zu etwa sechzig Sekunden, um jeden Standort zu erreichen. Ist sie danach noch alt, hält vielleicht dein Browser eine eigene Kopie fest; ein harter Reload behebt das meist. GitHubs Bild-Proxy respektiert die No-Cache-Header des Badges normalerweise, kann aber gelegentlich etwas länger hinterherhinken.

### Die Adresse wirkt unscharf oder zu klein

Verwende einen größeren `size-N`-Wert, statt das Bild mit HTML-Breitenangaben zu skalieren. Die Bitmap wird in hoher Auflösung gezeichnet, sodass Größen bis 40 auf den meisten Bildschirmen scharf bleiben. Wirken die Buchstaben ungleichmäßig, senke die Jitter-Stufe oder schalte sie mit `jitter-0` ab.

## Datenschutz

Der Dienst speichert eine einzige Zahl: die Position der aktiven Adresse in deiner Liste. Deine Adressliste und dein Token liegen in verschlüsselten Cloudflare-Secrets und erscheinen nie im Repository. Das Badge liest keine Cookies und nimmt keine Uploads an. Es setzt keinerlei Tracking ein und protokolliert keine Besucher.

Auf GitHub werden Bilder über GitHubs Proxy abgerufen, daher sieht das Badge normalerweise nie die IP-Adressen der Menschen, die dein Profil ansehen. Wie bei jeder Website kann Cloudflare nach seiner eigenen [Datenschutzerklärung](https://www.cloudflare.com/privacypolicy/) übliche Anfrageprotokolle führen.

## Haftungsausschluss

Diese Übersetzung dient nur der Information. Bei Abweichungen gilt die englische Fassung des README.

Die unter `readmes.pages.dev` gehostete Demo wird „wie besehen“ und kostenlos bereitgestellt, ohne jede ausdrückliche oder stillschweigende Gewährleistung. Das umfasst Gewährleistungen der Marktgängigkeit, der Eignung für einen bestimmten Zweck, der Verfügbarkeit und der Nichtverletzung von Rechten. Sie kann jederzeit ohne Vorankündigung gedrosselt, geändert oder abgeschaltet werden. Die Autoren haften nicht für Schäden aus ihrer Nutzung, einschließlich Spam, verlorener Nachrichten oder der Offenlegung einer Adresse, die du veröffentlichst.

Dieses Projekt erschwert das automatisierte Sammeln von E-Mail-Adressen. Es garantiert nicht, dass eine im Badge gezeigte Adresse privat bleibt, und es ist kein Sicherheitsprodukt.

Dieses Projekt steht in keiner Verbindung zu GitHub, Cloudflare oder Proton und wird von ihnen weder unterstützt noch gesponsert. Die Beispieladressen in diesem Dokument und in der Demo sind zur Veranschaulichung erfunden. Es ist nicht bekannt, dass sie jemandem gehören, also schreib bitte nicht an sie.

Wenn du eine eigene Kopie betreibst, bist allein du für die veröffentlichten Adressen und die sichere Aufbewahrung deines Wechsel-Tokens verantwortlich. Ebenso bist du dafür verantwortlich, die Bedingungen der genutzten Dienste und die Gesetze an deinem Wohnort einzuhalten.

Nichts in diesem Repository ist eine Rechtsberatung. Maßgeblich sind die Lizenztexte.

## Lizenz

Der Code steht unter der [GNU AGPL-3.0](LICENSE). Wenn du eine veränderte Version als öffentlichen Dienst betreibst, musst du deren Quellcode den Nutzern anbieten; eine öffentliche Template-Kopie auf GitHub erfüllt das.

Die Glyphen-Bitmaps in `src/email/font.generated.js` sind aus DejaVu Sans Mono Bold gerastert und stehen weiterhin unter der Bitstream-Vera-Lizenz in [LICENSE-FONT](LICENSE-FONT). Die Datei [NOTICE](NOTICE) fasst zusammen, welche Lizenz wo gilt.

---

<p align="center"><sub>© 2026 Aesthetic Vulpes (<a href="https://github.com/didvc">github.com/didvc</a>) · <a href="https://readmes.pages.dev/">readmes.pages.dev</a></sub></p>
