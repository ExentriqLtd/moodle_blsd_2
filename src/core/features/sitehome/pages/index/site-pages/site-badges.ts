// (C) Copyright 2015 Moodle Pty Ltd.
// Licensed under the Apache License, Version 2.0 (the "License");

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CoreUtils } from '@services/utils/utils';
import { ModalController, Translate } from '@singletons';
import { CoreLoginHelperProvider } from '@features/login/services/login-helper';
import { FAQ_QRCODE_IMAGE_HTML, FAQ_URL_IMAGE_HTML } from '@features/login/constants';

@Component({
    selector: 'core-login-site-help',
    templateUrl: 'site-badges.html',
    styleUrls: ['site-badges.scss'],

    // 👇👇 FIX OBBLIGATORIO 👇👇
    standalone: true,
    imports: [
        IonicModule,       // <ion-header>, <ion-content>, ecc.
        TranslateModule,   // | translate
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], // evita errori su web components
})
export class CoreLoginSiteBadgesComponent {

    urlImageHtml: string;
    setupLinkHtml: string;
    qrCodeImageHtml: string;
    canScanQR: boolean;

    constructor() {
        const noBadgeMsg = Translate.instant('home.nobadges');

        let firstname = '';
        const viewbadges = document.querySelector<HTMLElement>('.view-badges');
        if (viewbadges?.attributes['data-firstname']) {
            firstname = viewbadges.attributes['data-firstname'].value;
        }

        let lastname = '';
        if (viewbadges?.attributes['data-lastname']) {
            lastname = viewbadges.attributes['data-lastname'].value;
        }

        let parseddate = '';
        if (viewbadges?.attributes['data-bd']) {
            const bdate = viewbadges.attributes['data-bd'].value;
            try {
                const d = new Date(bdate);
                let m = d.getMonth() + 1;
                let month = m < 10 ? '0' + m : '' + m;

                const g = d.getDate();
                let day = g < 10 ? '0' + g : '' + g;

                parseddate = d.getFullYear() + month + day;
            } catch (e) {
                console.log(e);
            }
        }

        const url = 'https://art001exe.exentriq.com/93489/getBLSDCert?rand=' + new Date().getTime();
        const payload = {
            name: firstname,
            surname: lastname,
            birthDate: parseddate,
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data && data.length > 0) {
                const br2 = document.querySelector<HTMLElement>('.mybadges_result2');
                if (br2) {
                    let html = '';
                    for (let i = 0; i < data.length; i++) {
                        html += `
                            <div class='single_badge' style='margin-top: 10px;padding-top: 10px;border-top: 1px solid #ccc;'>
                                <div class='badge_img'><img src='${data[i].Image}'></div>
                                <div class='badge_desc' style='display:none'>${data[i].Certification}</div>
                            </div>
                        `;
                    }
                    br2.innerHTML = html;
                }
            } else {
                const br = document.querySelector<HTMLElement>('.mybadges_result2');
                if (br) {
                    br.innerHTML = `<div class='noBadgeMsg' style='padding:20px'>${noBadgeMsg}</div>`;
                }

                const br2 = document.querySelector<HTMLElement>('.no-mybadges_result');
                if (br2) {
                    br2.style.display = 'block';
                }
            }
        });

        this.canScanQR = CoreUtils.canScanQR();
        this.urlImageHtml = FAQ_URL_IMAGE_HTML;
        this.qrCodeImageHtml = FAQ_QRCODE_IMAGE_HTML;
        this.setupLinkHtml =
            `<a href="https://moodle.com/getstarted/" title="${Translate.instant('core.login.faqsetupsitelinktitle')}">https://moodle.com/getstarted/</a>`;
    }

    closeHelp(): void {
        const br2 = document.querySelector<HTMLElement>('.no-mybadges_result');
        if (br2) {
            br2.style.display = 'none';
        }
        ModalController.dismiss();
    }

}
