<script lang="ts">
    import Textfield from "@smui/textfield";
    import Button, { Label } from "@smui/button";
    import { Title, Content, Actions } from "@smui/dialog";
    import { createEventDispatcher } from "svelte";
    export let key = null;
    export let isOpen: boolean;
    export let isEdit: boolean;

    const reload = createEventDispatcher();

    function update() {
        fetch(`/api/add-key/${key.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                value: key.value,
            }),
        }).then(() => {
            reload("reload");
            isOpen = false;
            isEdit = false;
        });
    }

    function add() {
        fetch(`/api/add-key/nfc-${key.key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                value: key.value,
            }),
        }).then(() => {
            reload("reload");
            isOpen = false;
            isEdit = false;
        });
    }
</script>

<Title>{isEdit ? "Edit" : "Add"}</Title>
<Content>
    <div class="fields">
        <div>
            <Textfield disabled={isEdit} bind:value={key.key} label="Key" />
        </div>
        <div>
            <Textfield bind:value={key.value} label="Value" />
        </div>
    </div>
</Content>
<Actions>
    <Button on:click={() => (isOpen = false)}>
        <Label>Close</Label>
    </Button>
    <Button on:click={() => (isEdit ? update() : add())}>
        <Label>{isEdit ? "Update" : "Add"}</Label>
    </Button>
</Actions>

<style>
    .fields {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        gap: 10px;
    }
</style>
