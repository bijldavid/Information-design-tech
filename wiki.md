## <mark><samp> Week 1 **<sub><sup>:: Even inkomen</sup></sub>** </samp></mark>
**<sub><sup>13 okt t/m 17 okt</sup></sub>** <br>

Deze week was even inkomen op het gebied van JavaScript. We hebben geoefend met verschillende basisconcepten zoals wat objects ook al weer waren. Hiervoor hebben we oefen opdrachten gemaakt en daarna zijn we bezig geweest met de array-methodes: *filter*, *map* en *reduce*.


``` js

// map
let formattedCountries2 = countries.map(country => { ... })

// filter
southAsianCountries = formattedCountries.filter(formattedCountry => { ... })

// reduce
let southAsianMaxLifeExpectancy = southAsianCountries.reduce((highest, current) => { ... })

```

<br>
<br>

## <mark><samp> Herfst vakantie **<sub><sup>:: Vrij</sup></sub>** </samp></mark>
**<sub><sup>20 okt t/m 24 okt</sup></sub>** <br>

<br>
<br>

## <mark><samp> Week 2 **<sub><sup>:: Concept selectie</sup></sub>** </samp></mark>
**<sub><sup>27 okt t/m 31 okt</sup></sub>** <br>

### <samp>Progressie</samp>
Deze week hebben we voorbeeldwerk van Bink te zien gekregen. Dit gaf veel inzicht in waar we naartoe werken en hoe het eindresultaat er ongeveer uit kan zien. Ook gaf Laura een uitleg over documentatie.

Verder heb ik nagedacht over mijn concept. Uit mijn brainstormsessie kwamen de volgende ideeën:

<ul>
    <li>
        <strong>CityBikes API</strong> <br>
        Onderzoeksvraag: <em>Hoe verandert het gebruik van deelfietsen gedurende de dag in een stad?</em> <br>
        d3 visualisatie:
        <ul>
            <li>Interactieve kaart (met d3.geo)</li>
            <li>Barchart / linechart</li>
            <li>Timeline</li>
        </ul>
    </li>
    <li>
        <strong>OV API</strong> <br>
        Onderzoeksvraag: <em>Hoe varieert de drukte of vertraging over de dag/week?</em> <br>
        d3 visualisatie:
        <ul>
            <li>Interactieve kaart (met d3.geo)</li>
            <li>Timeline met delays</li>
            <li>Netwerkvisualisatie met d3-force</li>
        </ul>
    </li>
    <li>
        <strong>NS API</strong> <br>
        Onderzoeksvraag: <em>Hoe betrouwbaar zijn geplande vertrek- en aankomsttijden?</em> <br>
        d3 visualisatie:
        <ul>
            <li>Interactieve kaart (met d3.geo)</li>
            <li>Barchart / linechart</li>
        </ul>
    </li>
</ul>

<br>

### <samp>Concept</samp>
Uit deze selectie heb ik gekozen voor optie 3: de NS API. <br>

Uitwerking: Het plan is om uit de API de geplande vertrektijden te vergelijken met de daadwerkelijke aankomsttijden. Als de tijden overeenkomen, is er geen vertraging. Als er een verschil is, betekent dat dat er vertraging was. Ik focus me op de trein die ik elke ochtend neem: Hoorn → Amsterdam Centraal (Enkhuizen → Heerlen).

Ik moet een script schrijven dat elk uur een API-call maakt en de resultaten opslaat in een JSON-bestand. Zo creëer ik als het ware mijn eigen dataset waarmee ik de vertraging over de afgelopen periode kan visualiseren met d3. Lees hier in meer detail over mijn concept: [Concept uitleg](Concept)

<br>
<br>

## <mark><samp> Week 3 **<sub><sup>:: D3 progressie</sup></sub>** </samp></mark>
**<sub><sup>3 nov t/m 7 nov</sup></sub>**

### <samp>Progressie</samp>
Deze week stond in het teken van D3 leren en begrijpen. Dit deden we in 3 stappen:

<ol>
    <li>
        We begonnen met de basis principes van D3, namelijk: <br>
        <code>d3.select("...")</code> <br>
        <code>.selectAll("...")</code> <br>
        <code>.data(...)</code> <br> 
        <code>.join("...")</code> <br>
        <code>.attr("...")</code>            
    </li>
    <li>
        Nadat we de basis een beetje beheerde was het tijd om de scale functie te leren. Scales doen ..., hiervoor gebruik je <code>.domain</code> & <code>.range</code>
    </li>
    <li>
        Tot slot zijn we donderdag bezig geweest met het leren van dynamisch filteren.
    </li>
</ol>

Naast de D3 voortgang heb ik ook aardig wat vooruitgang geboekt op gebied van data filteren en klaarstomen voor de uiteindelijke d3 visualisatie. Ik heb veel geleerd over bijvoorbeeld de file structuur van sveltekit -> gebruik mapjes om de route te defineren en +server.js. Hoe je components gebruikt en het nut ervan! 

<br>

### <samp>Data verwerken & JSON opslag</samp>
Ik kan inmiddels de data opslaan in mijn eigen JSON-bestanden en ik verwerk deze data om uiteindelijk de vertraging te berekenen (mits die aanwezig is).

De flow die ik nu doorloop: ik maak vier verschillende API-calls →

1. arrivals Hoorn → `"https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=HN"`
2. arrivals Amsterdam →`"https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/arrivals?station=ASD"`
3. departures Hoorn → `"https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=HN"`
4. departures Amsterdam → `"https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=ASD"`

<br>

#### Departure logica
Departures Amsterdam geeft mij een grote array met allemaal departure-objecten terug.

De eerste stap die ik neem is de data filteren (met de `.filter()` method).  
In het departure-object zit een array genaamd `routeStations`. Deze array toont de verschillende stations waar de trein onder andere langs rijdt. Door te filteren op of **Hoorn** één van deze tussenstations is, houd ik alleen de departures richting Hoorn over.

Nadat ik de data heb gefilterd wil ik alleen de relevante data uit het object overhouden.  
Daarvoor gebruik ik de `.map()` method. Ik hou alleen dingen zoals:

- `trainNumber`
- `plannedDepartureTime`
- `actualDepartureTime`
- `direction`
- `isCancelled`
- `loggedAt`

Nu heb ik de data in het formaat dat ik nodig heb.  
Dus wordt het tijd om de data op te slaan in mijn JSON-bestandje. De flow hiervan gaat als volgt:

1. Lees het JSON-bestand en sla de inhoud op als string in een variabele.
2. Zet deze string om naar een JavaScript-object (array) en sla dit op in een nieuwe variabele.
3. Nu wil ik de nieuwe, getransformeerde data toevoegen aan dit object, maar ik moet voorkomen dat ik data dubbel toevoeg.  
   Daarom vergelijk ik mijn nieuwe data met de al bestaande data.  
   → Bestaat de entry nog niet? `push` hem op de array.  
   → Bestaat hij wel? Overschrijf de bestaande versie met dezelfde data.
4. Stringify het JavaScript-object en maak er weer JSON van.
5. Overschrijf het JSON-bestand met de geüpdatete data.

<br>

#### Arrival logica
Arrivals Hoorn geeft mij een grote array met arrival-objecten terug.

De eerste stap die ik neem is opnieuw de data filteren (met de `.filter()` method).  
Omdat er in arrival-objecten **geen `routeStations` array** zit, kan ik hier alleen filteren op basis van `origin`. Ik heb een array gemaakt met de meest voorkomende origins richting Enkhuizen en die gebruik ik in mijn filterfunctie.

Nadat ik de data heb gefilterd wil ik alleen de relevante data uit het object overhouden.  
Daarvoor gebruik ik weer de `.map()` method. Ik hou alleen dingen zoals:

- `trainNumber`
- `plannedArrivalTime`
- `actualArrivalTime`
- `origin`
- `isCancelled`
- `loggedAt`

Daarna volg ik exact dezelfde opslag-flow als hierboven (JSON lezen → parsen → duplicaten voorkomen → stringify → opslaan).

Dit proces herhaalt zich voor de omgekeerde versies op dezelfde manier (`arrivals Amsterdam` & `departures Hoorn`).

<br>

#### Delay logica
Op dit punt heb ik vier JSON-bestanden die gevuld worden met relevante data.

Het volgende doel is om deze data te gebruiken om vertraging te berekenen, indien aanwezig.  
Dat doe ik door:

1. Alle 4 de JSON-bestanden te lezen en op te slaan in variabelen.
2. Om de vertraging tussen een treinrit **Hoorn → Amsterdam** te berekenen moet ik de departure-tijd van Hoorn vergelijken met de arrival-tijd in Amsterdam.
3. Ik kan niet zomaar een willekeurige departure koppelen aan een willekeurige arrival. Ik moet corresponderende treinen hebben.

Daarom zoek ik een arrival en departure met hetzelfde `trainNumber`.

Maar alleen een matchend treinnummer is niet genoeg — hetzelfde nummer kan meerdere keren op een dag voorkomen.  
De combinatie:

- Treinnummer + datum/tijd

kan in principe maar één keer voorkomen en dus kan ik er vanuit gaan dat de departure en arrival bij elkaar horen.

<br>
<br>

## <mark><samp> Week 4 **<sub><sup>:: Svelte event handling & Bar chart</sup></sub>** </samp></mark>
**<sub><sup>10 nov t/m 14 nov</sup></sub>**

### <samp>Progressie</samp>
In week 4 hebben we nagedacht over wat technisch onderzoek is en hoe wij dat gaan documenteren voor de eindbeoordeling. Daarnaast hebben we geoefend en uitleg gehad over JavaScript Date-objecten. Ik heb geleerd dat JavaScript sinds 1 januari 1970 is begonnen met het tellen van milliseconden. Hiermee kan je dus wereldwijd, ongeacht de verschillende datum­systemen die bestaan, toch een consistente tijdsweergave tonen. <br>

Verder heb ik deze week gewerkt aan het implementeren van de daadwerkelijke D3-visualisatie. Ik ben begonnen met een simpele bar chart (wat eigenlijk helemaal niet simpel was). Deze is gekoppeld aan een aantal inputs die een event naar de parent sturen en op basis van dat event de D3-visualisatie dynamisch laten veranderen. <br>

<br>

### <samp>Svelte event routing<samp>
Om dit mooi werkend te krijgen moest ik eerst de features en structuur van Svelte een beetje ontdekken. Svelte geeft bepaalde handige features zoals `bind:value={variabeleNaam}`  en `on:change={functieNaam}`. Deze gebruik ik dan om events te dispatchen vanuit het kind-component naar de parent. De parent ontvangt deze met een `on:eventNaam={functieNaam}` en update dan de logica. De vernieuwde logica kan vervolgens vanuit de parent weer worden doorgestuurd naar alle andere kinderen als props. Dit is in een vogelvlucht hoe ik te werk ben gegaan met mijn componenten en event routing binnen Svelte.

<br>

### <samp>D3 Bar chart</samp>
Aan de D3-zijde van het verhaal moest ik ook flink sleutelen. Gelukkig kon ik de oefeningen van de les gebruiken om in ieder geval de basis van D3 te bouwen, maar al snel bleek dat een bar chart met een tijdlijn veel minder gemeen heeft dan een bubble chart over taxi’s en passengers.  
Mijn bar chart gebruikt bijvoorbeeld een `.timeScale()` als x-scale in plaats van een `.scalePoint()`.

Het grootste probleem waar ik tegenaan liep was de transition. Ik had gehoopt dat het zo simpel als `.transition()` toevoegen zou zijn en dat het dan gewoon zou werken, maar dat was helaas niet zo. Het probleem zat hem in het responsive maken van de chart. Ik gebruik `getBoundingClientRect()` om de hoogtes en breedtes van de SVG op te vragen. In combinatie met een `ResizeObserver` update ik dan steeds de afmetingen op basis van de nieuwe grootte.

Het probleem was dat de transition bleef retriggeren wanneer de chart opnieuw werd getekend, doordat de window werd gerescaled. Dus om dit te voorkomen moest ik een flag toevoegen:

```js
let shouldAnimate = false;

const resizeObserver = new ResizeObserver(() => {
    shouldAnimate = false;
    filterAndDraw();
});

resizeObserver.observe(svg);
```

Wanneer de SVG resized is, staat `shouldAnimate` op `false` en wordt de transition niet toegepast.

<br>
<br>

## <mark><samp> Week 5 **<sub><sup>:: Technisch onderzoek & Pie chart</sup></sub>** </samp></mark>
**<sub><sup>17 nov t/m 21 nov</sup></sub>**

### <samp>User tests & code review</samp>
We naderen nu het einde! Deze week hebben we user tests uitgevoerd en waaruit we onderling elkaar wat feedback gaven:

| User test 1 ||
|----------|-------------|
| Wat wil je testen? (onderzoeksvraag) | Je gebruikt mijn app: Begrijp je waar je terechtkomt? Wat wordt er van je verwacht? Begrijp je wat er gevisualiseerd wordt? |
| Wie heeft de test uitgevoerd? | Jamie |
| Hoe heb je het getest? (methode) | Thinking aloud / <mark>User trip **<sub><sup>(met scenario)</sup></sub>**</mark> |
| Wat viel je op? (samenvatting van bevindingen) | Jamie begrijp eigenlijk gelijk wat de bedoeling was van mijn product. Ik twijfel wel of dat komt doordat ik al een paar keer voor de klas heb verteld wat mijn product doet of dat de UI daadwerkelijk zo goed is. |
| Wat neem je mee? (conclusies) | Er missen labels en een legenda bij de chart. Zonder context is het lastig begrijpen wat er nou gevisualiseerd wordt |

| User test 2 ||
|----------|-------------|
| Wat wil je testen? (onderzoeksvraag) | Je gebruikt mijn app: Begrijp je waar je terechtkomt? Wat wordt er van je verwacht? Begrijp je wat er gevisualiseerd wordt? |
| Wie heeft de test uitgevoerd? | Mats |
| Hoe heb je het getest? (methode) | Thinking aloud / <mark>User trip **<sub><sup>(met scenario)</sup></sub>**</mark> |
| Wat viel je op? (samenvatting van bevindingen) | Mats weet ook ongeveer waar de app over gaat. Hij vond de vormgeving mooi en snapt waar ik naartoe werk. |
| Wat neem je mee? (conclusies) | De D3-visualisatie is veel te klein vond Mats. Hij stelt terecht: Het project draait om de datavisualisatie, dus geef de visualisatie meer ruimte zodat hij prominent in beeld is. |

Op de woensdag hebben wij code reviews uitgevoerd. Een medestudent bepaalde aan de hand van een beoordelingsformulier of ik voldoe aan de code standards (die de dag ervoor in de klas waren besproken). Hieruit kwam het volgende:

| Onderdeel | Beoordeling |
|----------|-------------|
| Is alle code geschreven in ES6, D3 en Svelte | Ja |
| Respecteert de code onze conventies? (names functions of arrow functions, vormgeving in CSS of, bij data dependency, in D3) | Ja |
| Wordt de code toegelicht door middel van comments? | Nee, maar dat komt nog |
| Hoe is de kwaliteit van de naamgeving van variabelen en functies, is het duidelijk wat hun rol is in de code? | Extreem goed |
| Kan reviewer in de code vinden:<br>- Data fetching<br>- Hoe de UI wordt opgebouwd<br>- Hoe de charts worden opgebouwd | Ja, het is opgedeeld in 4 bestanden wat prima is, maar de folder heet API |
| Zou de reviewer bereid zijn om de verantwoordelijkheid over dit project over te nemen in geval van nood? | 100% |
| Heeft reviewer tips over de code? | Voeg commentaar toe |

<br>

### <samp>Progressie</samp>
Aan het einde van week 5 ben ik verdergegaan met de tweede visualisatie die ik wilde toevoegen, namelijk iets dat alle data gebruikt. Tot nu toe heb ik een bar chart die de data van een specifieke dag weergeeft. Maar ik kan ook iets zeggen over alle data in z’n geheel: hoeveel treinen er uitvallen of vertraging hebben. Hiervoor besloot ik een simpele pie chart te bouwen (wederom niet echt bepaald simpel).

<br>
<br>

## <mark><samp> Week 6 **<sub><sup>:: Puntjes op de i</sup></sub>** </samp></mark>
**<sub><sup>24 nov t/m 28 nov</sup></sub>**

### <samp>D3 Progressie</samp>
Deze week hadden we nog een paar dagen om het product af te maken. Met bloed, zweet en tranen (en een beetje AI) is het gelukt om de pie chart te animeren. Na veel gesleutel kwam ik er zelf niet helemaal uit, dus heb ik het even losgelaten en uiteindelijk met AI opgelost.

Verder heb ik de tooltip uit de CodePen van Danny toegevoegd aan de bar chart. Op deze manier kun je de data van iedere individuele bar makkelijker aflezen. Ik heb de code voorzien van commentaar zodat ik in de toekomst nog begrijp hoe alles werkt. Hier en daar heb ik nog wat micro-animaties toegevoegd en natuurlijk de feedback uit week 5 toegepast.

Met trots presenteer ik een best wel volledig product: de Delay Finder!

<br>

### <samp>Uitbereiding en verbeter punten</samp>
Er zijn hier en daar nog wat features die ik zou kunnen toevoegen om het project nog cooler te maken. Als eerste zou een logische uitbreiding zijn dat het select-element ook daadwerkelijk iets doet. Op dit moment verandert er niets wanneer je een andere rail route kiest. Dat is natuurlijk verwarrend. Vanaf het begin leek het me een tof idee om dit project niet alleen te bouwen voor de treinroute die ik zelf altijd neem, maar voor meerdere routes. Daar ben ik uiteindelijk niet aan toegekomen, D3 en Svelte leren was al een opgave op zich, dus dit heb ik laten liggen. Visueel is de interface er wel op ingericht, dus houd daar rekening mee.

Hetzelfde geldt voor het kleine:

```html
 <small>100+</small>
```

Het was de bedoeling om dit getal te binden aan de hoeveelheid objecten in de array. Dan zou je in één oogopslag kunnen zien welke rail route veel data had en dus betrouwbaarder zou zijn (hoe meer data, hoe beter je conclusies kunt trekken).

Een ander verbeterpunt heeft te maken met het verzamelen van de data zelf. In de huidige visualisatie kun je geen onderscheid maken tussen een trein zonder vertraging en momenten waarop ik geen data heb opgehaald.

<figure>
    <img src="static/assets/project-example.png" width="500">
    <figcaption>In dit voorbeeld lijkt het alsof er in de ochtend geen vertraging was</figcaption>
</figure>

In werkelijkheid heb ik waarschijnlijk gewoon die ochtend niets gelogd. Dit geeft een vertekend beeld en maakt de data minder betrouwbaar.

Verder zijn er hier en daar nog kleine bugjes en fixes die ik had kunnen oplossen, maar al met al ben ik blij met het eindresultaat.