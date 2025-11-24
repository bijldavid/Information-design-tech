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
<br
Uit deze selectie heb ik gekozen voor optie 3: de NS API. <br>

Uitwerking: Het plan is om uit de API de geplande vertrektijden te vergelijken met de daadwerkelijke aankomsttijden. Als de tijden overeenkomen, is er geen vertraging. Als er een verschil is, betekent dat dat er vertraging was. Ik focus me op de trein die ik elke ochtend neem: Hoorn → Amsterdam Centraal (Enkhuizen → Heerlen).

Ik moet een script schrijven dat elk uur een API-call maakt en de resultaten opslaat in een JSON-bestand. Zo creëer ik als het ware mijn eigen dataset waarmee ik de vertraging over de afgelopen periode kan visualiseren met d3. Lees hier in meer detail over mijn concept: [Concept uitleg](Concept)

<br>
<br>

## <mark><samp> Week 3 **<sub><sup>:: D3 progressie</sup></sub>** </samp></mark>
**<sub><sup>3 nov t/m 7 nov</sup></sub>**

### <samp>Progressie</samp>
<br
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
<br
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

## <mark><samp> Week 4 **<sub><sup>:: D3 progressie</sup></sub>** </samp></mark>
**<sub><sup>10 nov t/m 14 nov</sup></sub>**

### <samp>Progressie</samp>
<br
In week 4 hebben we nagedacht over wat technisch onderzoek is en hoe wij dat gaan documenteren voor de eindbeoordeling. Daarnaast hebben we geoefent en uitleg gehad over javascript Date objecten. Ik heb geleerd dat javascript sinds ... is begonnen met tellen van mili seconden. Hiermee kan je dus wereldwijd ongeacht van de verschillende datum tellingen die er bestaan, toch een consistente tijdsweergeving tonen.

Verder heb ik deze week gewerkt aan het implementeren van de daadwerkelijke d3 visualistatie. Ik ben begonnen met een simpele barchart, deze is gekoppeld aan een aantal inputs in een ander component en zo kun je de d3 visualisatie met een klik op de knop dynamisch laten veranderen.<br>
<!-- <img src="/src/lib/assets/rail-direction-icon.svg"> -->

<br>
<br>

## <mark><samp> Week 5 **<sub><sup>:: D3 progressie</sup></sub>** </samp></mark>
**<sub><sup>10 nov t/m 14 nov</sup></sub>**

### <samp>Progressie</samp>
<br
We naderen nu het einde! Deze week hebben we user tests uitgevoerd en waaruit we onderling elkaar wat feedback gaven en op de woensdag hebben wij code reviews uitgevoerd. Een medestudent bepaalde aan de hand van een beoordelingsformulier of ik voldoe aan de code standards (die de dag ervoor in de klas waren besproken). Hieruit kwam het volgende:

| Onderdeel | Beoordeling |
|----------|-------------|
| Is alle code geschreven in ES6, D3 en Svelte | Ja |
| Respecteert de code onze conventies? (names functions of arrow functions, vormgeving in CSS of, bij data dependency, in D3) | Ja |
| Wordt de code toegelicht door middel van comments? | Nee, maar dat komt nog |
| Hoe is de kwaliteit van de naamgeving van variabelen en functies, is het duidelijk wat hun rol is in de code? | Extreem goed |
| Kan reviewer in de code vinden:<br>- Data fetching<br>- Hoe de UI wordt opgebouwd<br>- Hoe de charts worden opgebouwd | Ja, het is opgedeeld in 4 bestanden wat prima is, maar de folder heet API |
| Zou de reviewer bereid zijn om de verantwoordelijkheid over dit project over te nemen in geval van nood? | 100% |
| Heeft reviewer tips over de code? | Voeg commentaar toe |