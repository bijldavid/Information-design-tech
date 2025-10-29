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

---

## <mark><samp> Herfst vakantie :: **<sub><sup>:: Vrij</sup></sub>** </samp></mark>
**<sub><sup>20 okt t/m 24 okt</sup></sub>** <br>

<br>

---

## <mark><samp> Week 2 **<sub><sup>:: Concept selectie</sup></sub>** </samp></mark>
**<sub><sup>27 okt t/m 31 okt</sup></sub>** <br>

### Progressie
Deze week hebben we voorbeeldwerk van Bink te zien gekregen. Dit gaf veel inzicht in waar we naartoe werken en hoe het eindresultaat er ongeveer uit kan zien. Ook gaf Laura een uitleg over documentatie.

Verder heb ik nagedacht over mijn concept. Uit mijn brainstormsessie kwamen de volgende ideeën:

#### Idee 1
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

Uit deze selectie heb ik gekozen voor optie 3: de NS API. <br>

Uitwerking: Het plan is om uit de API de geplande vertrektijden te vergelijken met de daadwerkelijke aankomsttijden. Als de tijden overeenkomen, is er geen vertraging. Als er een verschil is, betekent dat dat er vertraging was. Ik focus me op de trein die ik elke ochtend neem: Hoorn → Amsterdam Centraal (Enkhuizen → Heerlen).

Ik moet een script schrijven dat elk uur een API-call maakt en de resultaten opslaat in een JSON-bestand. Zo creëer ik als het ware mijn eigen dataset waarmee ik de vertraging over de afgelopen periode kan visualiseren met d3. Qua visualisaties wil ik de volgende dingen maken:
<ul> 
    <li></li>
    <li></li>
    <li></li>
    <li></li>
</ul>

<br>

---

## <mark><samp> Week 3 **<sub><sup>:: D3 progressie</sup></sub>** </samp></mark>
**<sub><sup>... okt t/m ... okt</sup></sub>**
