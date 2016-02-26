"use strict";
var page = require('webpage').create(),
    system = require('system'),
    address, output, size, format, firstPageNumber, numberPagesFrom, header;

if (system.args.length < 3 || system.args.length > 7) {
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    format = system.args[3];
    firstPageNumber = Number(system.args[4]);
    numberPagesFrom = Number(system.args[5]);

    page.viewportSize = { width: 600, height: 600 };
    // if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
    //     size = system.args[3].split('*');
    //     page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
    //         : { format: system.args[3], orientation: 'portrait', margin: '1cm' };
    // } else if (system.args.length > 3 && system.args[3].substr(-2) === "px") {
    //     size = system.args[3].split('*');
    //     if (size.length === 2) {
    //         pageWidth = parseInt(size[0], 10);
    //         pageHeight = parseInt(size[1], 10);
    //         page.viewportSize = { width: pageWidth, height: pageHeight };
    //         page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
    //     } else {
    //         console.log("size:", system.args[3]);
    //         pageWidth = parseInt(system.args[3], 10);
    //         pageHeight = parseInt(pageWidth * 3 / 4, 10); // it's as good an assumption as any
    //         console.log("pageHeight:", pageHeight);
    //         page.viewportSize = { width: pageWidth, height: pageHeight };
    //     }
    // }
    // if (system.args.length > 4) {
    //     page.zoomFactor = system.args[4];
    // }

    page.paperSize = {
        format: format,
        orientation: 'portrait',
        margin: '.5in',
        header: {
            height: ".5cm",
            contents: phantom.callback(function(pageNum, numPages) {
                var currentPageNumber = (Number(pageNum) - 1) + firstPageNumber
                var showNumber = currentPageNumber >= numberPagesFrom
                if (!showNumber) return "<div></div>"
                return "<div style='font-family: sans-serif; font-size: 50%; posiiton:relative;'><span style='position:absolute; top:0; right:8;'>"+ currentPageNumber + "</span></div>";
            })
        },
        footer: {
            height: ".5cm",
            contents: phantom.callback(function(pageNum, numPages) {
                return "<div style='font-family: sans-serif; font-size: 50%;'>&copy; 2016 The RBL Group</div>";
            })
        }
    }

    page.open(address, function(status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
            phantom.exit(1);
        } else {
            window.setTimeout(function() {
                page.render(output);
                phantom.exit();
            }, 200);
        }
    });
}