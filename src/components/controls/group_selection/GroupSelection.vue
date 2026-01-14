<template>
    <div class="k board-selection">
        <select ref="select" :value="value" @change="onChange" :multiple="multiple" style="width: 100%">
            <optgroup v-for="group in options" :key="group.label" :label="group.label">
                <option v-for="item in group.items" :key="item.value" :value="item.value">
                {{ item.text }}
                </option>
            </optgroup>
        </select>
    </div>
</template>
<script>
    export default{
        data(){
            return{
            }
        },
        props: {
            value: [String, Array], // Single or multiple selected values
            options: {
                type: Array,
                required: true,
                default :
                [
                    // { label: 'Group 1', items: [{ value: '1', text: 'Option 1' }, { value: '2', text: 'Option 2' }] },
                    // { label: 'Group 2', items: [{ value: '3', text: 'Option 3' }, { value: '4', text: 'Option 4' }] },
                ]
            },
            placeholder: {
                type: String,
                default: 'Search and select an option',
            },
            multiple: {
                type: Boolean,
                default: false,
            },
        },
        mounted() {
            // Initialize Select2 with Search
            $(this.$refs.select)
            .select2({
                placeholder: this.placeholder,
                allowClear: true,
            })
            .on('select2:select select2:unselect', () => {
                this.$emit('input', $(this.$refs.select).val());
            });
        },
        watch: {
            // Update Select2 whenever `value` or `options` changes
            value(newValue) {
                $(this.$refs.select).val(newValue).trigger('change');
            },
            options: {
                handler() {
                    this.refreshOptions();
                },
                deep: true,
            },
        },
        methods: {
            onChange(event) {
                const selected = Array.from(event.target.options)
                    .filter(option => option.selected)
                    .map(option => option.value);
                this.$emit('input', this.multiple ? selected : selected[0]);
            },
            refreshOptions() {
            $(this.$refs.select).empty(); // Clear existing options
                this.$nextTick(() => {
                    $(this.$refs.select).select2({
                    placeholder: this.placeholder,
                    allowClear: true,
                    });
                });
            },
        },
        beforeDestroy() {
            // Clean up to avoid memory leaks
            $(this.$refs.select).select2('destroy');
        },
    }
</script>
<style src="./GroupSelection.css" scoped></style>