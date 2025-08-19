<script lang="ts">
import { AUTO_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants.ts";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import {
	applyThemeToDocument,
	getStoredTheme,
	setTheme,
	getDefaultHue,
	getHue,
	setHue,
} from "@utils/setting-utils.ts";
import { onMount } from "svelte";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE, AUTO_MODE];
let mode: LIGHT_DARK_MODE = $state(AUTO_MODE);

// 颜色主题相关状态
let hue = $state(getHue());
const defaultHue = getDefaultHue();

function resetHue() {
	hue = getDefaultHue();
}

$effect(() => {
	if (hue || hue === 0) {
		setHue(hue);
	}
});

onMount(() => {
	mode = getStoredTheme();
	const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
	const changeThemeWhenSchemeChanged: Parameters<
		typeof darkModePreference.addEventListener<"change">
	>[1] = (_e) => {
		applyThemeToDocument(mode);
	};
	darkModePreference.addEventListener("change", changeThemeWhenSchemeChanged);
	return () => {
		darkModePreference.removeEventListener(
			"change",
			changeThemeWhenSchemeChanged,
		);
	};
});

function switchScheme(newMode: LIGHT_DARK_MODE) {
	mode = newMode;
	setTheme(newMode);
}

function toggleScheme() {
	let i = 0;
	for (; i < seq.length; i++) {
		if (seq[i] === mode) {
			break;
		}
	}
	switchScheme(seq[(i + 1) % seq.length]);
}

function showPanel() {
	const panel = document.querySelector("#light-dark-panel");
	panel.classList.remove("float-panel-closed");
}

function hidePanel() {
	const panel = document.querySelector("#light-dark-panel");
	panel.classList.add("float-panel-closed");
}
</script>

<!-- z-50 make the panel higher than other float panels -->
<div class="relative z-50" role="menu" tabindex="-1" onmouseleave={hidePanel}>
    <button aria-label="Light/Dark Mode" role="menuitem" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" id="scheme-switch" onclick={toggleScheme} onmouseenter={showPanel}>
        <div class="absolute" class:opacity-0={mode !== LIGHT_MODE}>
            <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute" class:opacity-0={mode !== DARK_MODE}>
            <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]"></Icon>
        </div>
        <div class="absolute" class:opacity-0={mode !== AUTO_MODE}>
            <Icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem]"></Icon>
        </div>
    </button>

    <div id="light-dark-panel" class="hidden lg:block absolute transition float-panel-closed top-11 -right-2 pt-5" >
        <div class="card-base float-panel p-2 w-64">
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
                    class:current-theme-btn={mode === LIGHT_MODE}
                    onclick={() => switchScheme(LIGHT_MODE)}
            >
                <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.lightMode)}
            </button>
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5"
                    class:current-theme-btn={mode === DARK_MODE}
                    onclick={() => switchScheme(DARK_MODE)}
            >
                <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.darkMode)}
            </button>
            <button class="flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-3"
                    class:current-theme-btn={mode === AUTO_MODE}
                    onclick={() => switchScheme(AUTO_MODE)}
            >
                <Icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem] mr-3"></Icon>
                {i18n(I18nKey.systemMode)}
            </button>
            
            <!-- 主题颜色滑动条 -->
            <div class="border-t border-[var(--line-divider)] pt-3">
                <div class="flex flex-row gap-2 mb-3 items-center justify-between">
                    <div class="flex gap-2 font-medium text-sm text-75 transition relative">
                        <Icon icon="material-symbols:palette-outline" class="text-[1rem] mr-1"></Icon>
                        {i18n(I18nKey.themeColor)}
                        <button aria-label="Reset to Default" class="btn-regular w-5 h-5 rounded-md active:scale-90 ml-1"
                                class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} onclick={resetHue}>
                            <div class="text-[var(--btn-content)]">
                                <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.625rem]"></Icon>
                            </div>
                        </button>
                    </div>
                    <div class="flex gap-1">
                        <div class="transition bg-[var(--btn-regular-bg)] w-8 h-5 rounded text-xs flex justify-center items-center text-[var(--btn-content)] font-medium">
                            {hue}
                        </div>
                    </div>
                </div>
                <div class="w-full h-4 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none">
                    <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
                           class="color-slider" step="5" style="width: 100%">
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="stylus">
    .color-slider
        -webkit-appearance none
        height 1rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out
        border-radius 0.25rem
        outline none

        /* Input Thumb */
        &::-webkit-slider-thumb
            -webkit-appearance none
            height 0.75rem
            width 0.375rem
            border-radius 0.125rem
            background rgba(255, 255, 255, 0.9)
            box-shadow 0 1px 3px rgba(0, 0, 0, 0.3)
            cursor pointer
            &:hover
                background rgba(255, 255, 255, 1)
            &:active
                background rgba(255, 255, 255, 0.8)

        &::-moz-range-thumb
            -webkit-appearance none
            height 0.75rem
            width 0.375rem
            border-radius 0.125rem
            border-width 0
            background rgba(255, 255, 255, 0.9)
            box-shadow 0 1px 3px rgba(0, 0, 0, 0.3)
            cursor pointer
            &:hover
                background rgba(255, 255, 255, 1)
            &:active
                background rgba(255, 255, 255, 0.8)

        &::-ms-thumb
            -webkit-appearance none
            height 0.75rem
            width 0.375rem
            border-radius 0.125rem
            background rgba(255, 255, 255, 0.9)
            box-shadow 0 1px 3px rgba(0, 0, 0, 0.3)
            cursor pointer
            &:hover
                background rgba(255, 255, 255, 1)
            &:active
                background rgba(255, 255, 255, 0.8)
</style>
