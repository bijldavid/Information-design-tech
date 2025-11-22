<script>

</script>

<header>
    <nav>
        <a class="highlight" href="/">Find delay</a>
        <div>
            <a href="#">Documentation</a>
        </div>
    </nav>
</header>

<style>
    header {
        max-width: 1000px;
        margin-inline: auto;
        margin-block: 2rem;
        padding: 1rem;
    }

    header nav {
        border: 1px solid var(--border);
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    header nav a {
        position: relative;
        text-transform: uppercase;
        color: var(--text);
    }

    header nav a.highlight {
        padding: .5rem 2.5rem .5rem .5rem;
        background: var(--NS-yellow);
    }

    header nav a {
        padding-inline-end: 2rem;
    }

    header nav a::after {
        position: absolute;
        content: '';
        top: 50%;
        right: 0;
        translate: 0 -50%;
        height: 1rem;
        aspect-ratio: 1;
        background-image: url(/static/assets/external-arrow.svg);
        background-repeat: no-repeat;
        background-size: 60%;
        background-position: center;
    }

    header nav a.highlight::after {
        right: .5rem;
    }

    header nav div {
        display: flex;
        gap: 1rem;
    }
</style>