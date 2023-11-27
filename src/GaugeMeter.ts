// GaugeMeter.ts
// An elegant and dynamic graphical gauge meter built with Typescript.
//
// Copyright (c) 2023 Michael Wolf <michael@mictronics.de>
//
// This file is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// any later version.
//
// This file is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

interface IGaugeMeterOptions {
    [index: string]: number | string | boolean;
    id: string;
    percent: number;
    used: number;
    min: number;
    total: number;
    size: number;
    prepend: string;
    append: string;
    theme: string;
    color: string;
    fgcolor: string;
    back: string;
    width: number;
    style: string;
    stripe: number;
    animationstep: number;
    animate_gauge_colors: boolean;
    animate_text_colors: boolean;
    label: string;
    label_color: string;
    text: string;
    text_size: number;
    fill: string;
    showvalue: boolean;
}

type Point = {
    x: number;
    y: number;
}

class GaugeMeter {
    /**
     * Default gauge options.
     */
    private options: IGaugeMeterOptions = Object.seal({
        id: '',
        percent: 0,
        used: NaN,
        min: NaN,
        total: NaN,
        size: 100,
        prepend: '',
        append: '',
        theme: 'Red-Gold-Green',
        color: '',
        fgcolor: '',
        back: 'RGBa(0,0,0,.06)',
        width: 3,
        style: 'Full',
        stripe: 0,
        animationstep: 1,
        animate_gauge_colors: false,
        animate_text_colors: false,
        label: '',
        label_color: 'Black',
        text: '',
        text_size: 0.22,
        fill: '',
        showvalue: false
    });

    /**
     * Accepted data attributes.
     */
    private dataAttr: string[] = [
        'percent',
        'used',
        'min',
        'total',
        'size',
        'prepend',
        'append',
        'theme',
        'color',
        'back',
        'width',
        'style',
        'stripe',
        'animationstep',
        'animate_gauge_colors',
        'animate_text_colors',
        'label',
        'label_color',
        'text',
        'text_size',
        'fill',
        'showvalue'
    ];

    private element: HTMLElement;
    private spanText: string;
    private gaugeValue: number;
    private animationValue: number;
    private maxAnimationStep: number;
    private arcRadius: number;
    private arcStart: number;
    private arcEnd: number;
    private halfPi: number;
    private doublePi: number;
    private canvasElement: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private canvasCenter: Point = { x: 0, y: 0 };

    /**
     * Get a theme color depending on gauge value.
     * @param e The gauge value.
     * @returns HTML color string.
     */
    private getThemeColor(e: number): string {
        // Return fix color if defined.
        if (this.options.color !== '' && this.options.color !== null && this.options.color !== undefined) {
            return this.options.color;
        }
        // Otherwise pick one from themes depending on gauge value.
        let t = '#f8590a';
        return (
            e || (e = 1e-14),
            'Red-Gold-Green' === this.options.theme &&
            (e > 0 && (t = '#d90000'),
                e > 10 && (t = '#e32100'),
                e > 20 && (t = '#f35100'),
                e > 30 && (t = '#ff8700'),
                e > 40 && (t = '#ffb800'),
                e > 50 && (t = '#ffd900'),
                e > 60 && (t = '#dcd800'),
                e > 70 && (t = '#a6d900'),
                e > 80 && (t = '#69d900'),
                e > 90 && (t = '#32d900')),
            'Green-Gold-Red' === this.options.theme &&
            (e > 0 && (t = '#32d900'),
                e > 10 && (t = '#69d900'),
                e > 20 && (t = '#a6d900'),
                e > 30 && (t = '#dcd800'),
                e > 40 && (t = '#ffd900'),
                e > 50 && (t = '#ffb800'),
                e > 60 && (t = '#ff8700'),
                e > 70 && (t = '#f35100'),
                e > 80 && (t = '#e32100'),
                e > 90 && (t = '#d90000')),
            'Green-Red' === this.options.theme &&
            (e > 0 && (t = '#32d900'),
                e > 10 && (t = '#41c900'),
                e > 20 && (t = '#56b300'),
                e > 30 && (t = '#6f9900'),
                e > 40 && (t = '#8a7b00'),
                e > 50 && (t = '#a75e00'),
                e > 60 && (t = '#c24000'),
                e > 70 && (t = '#db2600'),
                e > 80 && (t = '#f01000'),
                e > 90 && (t = '#ff0000')),
            'Red-Green' === this.options.theme &&
            (e > 0 && (t = '#ff0000'),
                e > 10 && (t = '#f01000'),
                e > 20 && (t = '#db2600'),
                e > 30 && (t = '#c24000'),
                e > 40 && (t = '#a75e00'),
                e > 50 && (t = '#8a7b00'),
                e > 60 && (t = '#6f9900'),
                e > 70 && (t = '#56b300'),
                e > 80 && (t = '#41c900'),
                e > 90 && (t = '#32d900')),
            'DarkBlue-LightBlue' === this.options.theme &&
            (e > 0 && (t = '#2c94e0'),
                e > 10 && (t = '#2b96e1'),
                e > 20 && (t = '#2b99e4'),
                e > 30 && (t = '#2a9ce7'),
                e > 40 && (t = '#28a0e9'),
                e > 50 && (t = '#26a4ed'),
                e > 60 && (t = '#25a8f0'),
                e > 70 && (t = '#24acf3'),
                e > 80 && (t = '#23aff5'),
                e > 90 && (t = '#21b2f7')),
            'LightBlue-DarkBlue' === this.options.theme &&
            (e > 0 && (t = '#21b2f7'),
                e > 10 && (t = '#23aff5'),
                e > 20 && (t = '#24acf3'),
                e > 30 && (t = '#25a8f0'),
                e > 40 && (t = '#26a4ed'),
                e > 50 && (t = '#28a0e9'),
                e > 60 && (t = '#2a9ce7'),
                e > 70 && (t = '#2b99e4'),
                e > 80 && (t = '#2b96e1'),
                e > 90 && (t = '#2c94e0')),
            'DarkRed-LightRed' === this.options.theme &&
            (e > 0 && (t = '#d90000'),
                e > 10 && (t = '#dc0000'),
                e > 20 && (t = '#e00000'),
                e > 30 && (t = '#e40000'),
                e > 40 && (t = '#ea0000'),
                e > 50 && (t = '#ee0000'),
                e > 60 && (t = '#f30000'),
                e > 70 && (t = '#f90000'),
                e > 80 && (t = '#fc0000'),
                e > 90 && (t = '#ff0000')),
            'LightRed-DarkRed' === this.options.theme &&
            (e > 0 && (t = '#ff0000'),
                e > 10 && (t = '#fc0000'),
                e > 20 && (t = '#f90000'),
                e > 30 && (t = '#f30000'),
                e > 40 && (t = '#ee0000'),
                e > 50 && (t = '#ea0000'),
                e > 60 && (t = '#e40000'),
                e > 70 && (t = '#e00000'),
                e > 80 && (t = '#dc0000'),
                e > 90 && (t = '#d90000')),
            'DarkGreen-LightGreen' === this.options.theme &&
            (e > 0 && (t = '#32d900'),
                e > 10 && (t = '#33db00'),
                e > 20 && (t = '#34df00'),
                e > 30 && (t = '#34e200'),
                e > 40 && (t = '#36e700'),
                e > 50 && (t = '#37ec00'),
                e > 60 && (t = '#38f100'),
                e > 70 && (t = '#38f600'),
                e > 80 && (t = '#39f900'),
                e > 90 && (t = '#3afc00')),
            'LightGreen-DarkGreen' === this.options.theme &&
            (e > 0 && (t = '#3afc00'),
                e > 10 && (t = '#39f900'),
                e > 20 && (t = '#38f600'),
                e > 30 && (t = '#38f100'),
                e > 40 && (t = '#37ec00'),
                e > 50 && (t = '#36e700'),
                e > 60 && (t = '#34e200'),
                e > 70 && (t = '#34df00'),
                e > 80 && (t = '#33db00'),
                e > 90 && (t = '#32d900')),
            'DarkGold-LightGold' === this.options.theme &&
            (e > 0 && (t = '#ffb800'),
                e > 10 && (t = '#ffba00'),
                e > 20 && (t = '#ffbd00'),
                e > 30 && (t = '#ffc200'),
                e > 40 && (t = '#ffc600'),
                e > 50 && (t = '#ffcb00'),
                e > 60 && (t = '#ffcf00'),
                e > 70 && (t = '#ffd400'),
                e > 80 && (t = '#ffd600'),
                e > 90 && (t = '#ffd900')),
            'LightGold-DarkGold' === this.options.theme &&
            (e > 0 && (t = '#ffd900'),
                e > 10 && (t = '#ffd600'),
                e > 20 && (t = '#ffd400'),
                e > 30 && (t = '#ffcf00'),
                e > 40 && (t = '#ffcb00'),
                e > 50 && (t = '#ffc600'),
                e > 60 && (t = '#ffc200'),
                e > 70 && (t = '#ffbd00'),
                e > 80 && (t = '#ffba00'),
                e > 90 && (t = '#ffb800')),
            'White' === this.options.theme && (t = '#fff'),
            'Black' === this.options.theme && (t = '#000'),
            t
        );
    }

    /**
     * Get data attributes as options from div tag. Fall back to defaults when not exists.
     */
    private getDataAttr() {
        for (const attr of this.dataAttr) {
            if (this.element.dataset[attr] === undefined || this.element.dataset[attr] === null) {
                continue;
            }
            const v = this.element.dataset[attr];

            switch (attr) {
                case 'size':
                case 'width':
                case 'animationstep':
                case 'stripe':
                case 'percent':
                case 'used':
                case 'min':
                case 'total':
                    this.options[attr] = parseInt(v, 10);
                    break;
                case 'text_size':
                    this.options[attr] = parseFloat(v);
                    break;
                case 'animate_gauge_colors':
                case 'animate_text_colors':
                case 'showvalue':
                    this.options[attr] = (v === 'true');
                    break;
                default:
                    this.options[attr] = v;
                    break;
            }
        }
    }

    /**
     * The label below gauge.
     * @param size The label size.
     */
    private createLabel(size: number) {
        if (this.element.getElementsByTagName('b').length === 0) {
            const b = document.createElement('b');
            b.innerHTML = this.options.label;
            b.style.setProperty('line-height', `${this.options.size + 5 * size}px`);
            b.style.setProperty('color', this.options.label_color);
            this.element.appendChild(b);
        }
    }

    /**
     * Prepend and append text, the gauge text or percentage value.
     */
    private createSpanTag() {
        let fgcolor = '';
        if (this.options.animate_text_colors === true) {
            fgcolor = this.options.fgcolor;
        }
        const child = this.element.getElementsByTagName('span');
        if (child.length !== 0) {
            child[0].innerHTML = this.spanText;
            child[0].style.setProperty('color', this.options.fgcolor);
            return;
        }
        if (this.options.text_size <= 0.0 || Number.isNaN(this.options.text_size)) {
            this.options.text_size = 0.22;
        }
        if (this.options.text_size > 0.5) {
            this.options.text_size = 0.5;
        }
        const span = document.createElement('span');
        span.innerHTML = this.spanText;
        span.style.setProperty('line-height', `${this.options.size}px`);
        span.style.setProperty('font-size', `${this.options.text_size * this.options.size}px`);
        span.style.setProperty('color', fgcolor);
        this.element.appendChild(span);
    }

    /**
     * Draws the gauge.
     */
    private drawGauge(val: number) {
        if (this.options.animate_gauge_colors) {
            // Set gauge color for each value change.
            this.options.fgcolor = this.getThemeColor(val * 100);
        }
        if (this.animationValue < 0) this.animationValue = 0;
        if (this.animationValue > 100) this.animationValue = 100;
        const lw = this.options.width < 1 || isNaN(this.options.width) ? this.options.size / 20 : this.options.width;
        this.canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        this.canvasContext.beginPath();
        this.canvasContext.arc(this.canvasCenter.x, this.canvasCenter.y, this.arcRadius, this.arcStart, this.arcEnd, !1);
        if (this.options.fill !== '') {
            this.canvasContext.fillStyle = this.options.fill;
            this.canvasContext.fill();
        }
        this.canvasContext.lineWidth = lw;
        this.canvasContext.strokeStyle = this.options.back;
        if (this.options.stripe > 0) {
            this.canvasContext.setLineDash([this.options.stripe])
        } else {
            this.canvasContext.lineCap = 'round';
        }
        this.canvasContext.stroke();
        this.canvasContext.beginPath();
        this.canvasContext.arc(this.canvasCenter.x, this.canvasCenter.y, this.arcRadius, -this.halfPi, this.doublePi * val - this.halfPi, !1);
        this.canvasContext.lineWidth = lw;
        this.canvasContext.strokeStyle = this.options.fgcolor;
        this.canvasContext.stroke();
        if (this.gaugeValue > this.animationValue) {
            this.animationValue += this.maxAnimationStep;
            window.requestAnimationFrame(() => {
                this.drawGauge(Math.min(this.animationValue, this.gaugeValue) / 100);
                if (this.options.animate_text_colors) {
                    // Set text color for each value change.
                    this.element.getElementsByTagName('span')[0].style.setProperty('color', this.options.fgcolor);
                }
                const output = this.element.getElementsByTagName('output');
                if (output.length !== 0) {
                    if (this.options.showvalue === true) {
                        output[0].innerText = `${this.options.used}`;
                    } else {
                        output[0].innerText = `${this.animationValue}`;
                    }
                }
            });
        }
    }

    constructor(e: HTMLElement) {
        this.element = e;
        this.element.dataset.id = this.element.getAttribute('id');
        this.element.classList.add('gaugeMeter');
        this.gaugeValue = 0;
        this.update();
    }

    /**
     * Updates the gauge meter either from data properties or given options object.
     * @param opt options object to update from
     */
    public update(opt?: any) {
        if (typeof opt === 'object') {
            Object.assign(this.options, opt);
        } else {
            this.getDataAttr();
        }
        if (Number.isInteger(this.options.used) && Number.isInteger(this.options.total)) {
            let u = this.options.used;
            let t = this.options.total;
            if (Number.isInteger(this.options.min)) {
                if (this.options.min < 0) {
                    t -= this.options.min;
                    u -= this.options.min;
                }
            }
            this.gaugeValue = u / (t / 100);
        } else {
            this.gaugeValue = this.options.percent;
        }
        if (this.gaugeValue < 0) this.gaugeValue = 0;
        if (this.gaugeValue > 100) this.gaugeValue = 100;

        if (this.options.text !== '' && this.options.text !== null && this.options.text !== undefined) {
            if (this.options.append !== '' && this.options.append !== null && this.options.append !== undefined) {
                this.spanText = this.options.text + '<u>' + this.options.append + '</u>';
            } else {
                this.spanText = this.options.text;
            }
            if (this.options.prepend !== '' && this.options.prepend !== null && this.options.prepend !== undefined) {
                this.spanText = '<s>' + this.options.prepend + '</s>' + this.spanText;
            }
        } else {
            if (this.options.showvalue === true) {
                this.spanText = '<output>' + this.options.used + '</output>';
            } else {
                this.spanText = `<output>${this.gaugeValue}</output>`;
            }
            if (this.options.prepend !== '' && this.options.prepend !== null && this.options.prepend !== undefined) {
                this.spanText = '<s>' + this.options.prepend + '</s>' + this.spanText;
            }

            if (this.options.append !== '' && this.options.append !== null && this.options.append !== undefined) {
                this.spanText = this.spanText + '<u>' + this.options.append + '</u>';
            }
        }

        // Pick initial gauge and text color.
        this.options.fgcolor = this.getThemeColor(this.gaugeValue);
        this.createSpanTag();

        if (this.options.style !== '' && this.options.style !== null && this.options.style !== undefined) {
            this.createLabel(this.options.size / 13);
        }

        this.element.style.setProperty('width', `${this.options.size}px`);
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.width = this.options.size;
        this.canvasElement.height = this.options.size;
        this.canvasContext = this.canvasElement.getContext('2d');
        this.canvasCenter.x = this.canvasElement.width / 2;
        this.canvasCenter.y = this.canvasElement.height / 2;
        this.doublePi = 2 * Math.PI;
        this.halfPi = Math.PI / 2;
        this.arcEnd = 2.3 * Math.PI;
        this.arcStart = 0;
        this.arcRadius = ((360 * this.options.percent) * (Math.PI / 180), this.canvasElement.width / 2.5);
        this.maxAnimationStep = Math.max(this.options.animationstep, 0);
        this.animationValue = 0 === this.options.animationstep ? this.gaugeValue : 0;
        const cc = this.element.getElementsByTagName('canvas');
        if (cc.length !== 0) {
            /* Replace existing canvas when new percentage was written. */
            cc[0].replaceWith(this.canvasElement);
        } else {
            /* Initially create canvas. */
            this.element.appendChild(this.canvasElement);
        }

        if ('Semi' === this.options.style) {
            this.arcEnd = 2 * Math.PI;
            this.arcStart = 3.13;
            this.doublePi = 1 * Math.PI;
            this.halfPi = Math.PI / 0.996;
        } else if ('Arch' === this.options.style) {
            this.arcEnd = 2.195 * Math.PI;
            this.arcStart = 655.99999;
            this.doublePi = 1.4 * Math.PI;
            this.halfPi = Math.PI / 0.8335;
        }

        this.drawGauge(this.animationValue / 100);
    }
}
