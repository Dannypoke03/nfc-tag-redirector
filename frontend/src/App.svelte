<script lang="ts">
    import Button, { Label } from "@smui/button";
    import Dialog, { Title, Content, Actions } from "@smui/dialog";
    import Edit from "./lib/Edit.svelte";
    let data;
    async function getData() {
        const response = await fetch("/api/all-keys");
        data = await response.json();
    }

    getData();

    let openEdit = false;

    let selKey = null;
    let isEdit = false;

    function edit(key) {
        selKey = key;
        isEdit = true;
        openEdit = true;
    }

    function deleteKey(key) {
        fetch(`/api/delete-key/${key.key}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            getData();
        });
    }

    function addKey() {
        selKey = {
            key: "",
            value: "",
        };
        openEdit = true;
        isEdit = false;
    }
</script>

<link rel="stylesheet" href="node_modules/svelte-material-ui/bare.css" />
<link defer rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono" />

<main>
    <h1>All keys</h1>
    <Button on:click={() => addKey()}>
        Add key <i class="fa-solid fa-plus" />
    </Button>
    {#if data}
        <div class="keys">
            <div><b>Name</b></div>
            <div><b>Value</b></div>
            <div />
            <div />
            <div />
            {#each data as key}
                <div class="key">
                    {key.key}
                </div>
                <div class="key">
                    {key.value}
                </div>
                <div>
                    <Button on:click={() => navigator.clipboard.writeText(`${location.host}/api/redirect/${key.key}`)}>
                        <i class="fa-solid fa-copy"></i>
                    </Button>
                </div>
                <div>
                    <Button on:click={() => edit(key)}>
                        <i class="fa-solid fa-pen-to-square" />
                    </Button>
                </div>
                <div>
                    <Button on:click={() => deleteKey(key)}>
                        <i style="color: #b00020" class="fa-solid fa-trash-can" />
                    </Button>
                </div>
            {/each}
        </div>
    {/if}
</main>
<Dialog bind:open={openEdit}>
    {#if openEdit}
        <Edit on:reload={() => getData()} isOpen={openEdit} {isEdit} key={selKey} />
    {/if}
</Dialog>

<style>
    .keys {
        display: grid;
        grid-template-columns: 1fr 1fr 0.5fr 0.5fr 0.5fr;
    }
    .keys > div {
        display: flex;
        flex-direction: row;
        gap: 5px;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding: 8px;
    }
</style>
