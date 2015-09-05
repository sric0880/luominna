/*
 * jQuery File Upload Plugin JS Example
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 */
var Base64 = {
  // private property
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
function calcSign(policy, secret) {
    return SparkMD5.hash(policy + "&" + secret);
}
/* global $, window */
external_pic_url = "http://luominna.b0.upaiyun.com";
upyun_api_url = "http://v0.api.upyun.com/luominna";
$(document).ready(
    function() {
        'use strict';
        // Initialize the jQuery File Upload widget:
        $('#fileupload').fileupload();
        $('#fileupload').fileupload(
            'option', {
                url: upyun_api_url,
                type : 'POST',
                // maxFileSize : 999000,
                maxNumberOfFiles : 1,
                // Enable image resizing, except for Android and Opera,
                // which actually support image resizing, but fail to
                // send Blob objects via XHR requests:
                disableImageResize: /Android(?!.*Chrome)|Opera/
                    .test(window.navigator.userAgent),
                // imageMaxWidth: 800,
                // imageMaxHeight: 800,
                // imageCrop: true,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                uploadTemplateId: null,
                downloadTemplateId: null,
                uploadTemplate: function (o) {
                    var rows = $();
                    $.each(o.files, function (index, file) {
                        var row = $('<tr class="template-upload fade">' +
                            '<td><span class="preview"></span></td>' +
                            '<td><p class="name"></p>' +
                            '<div class="error"></div>' +
                            '</td>' +
                            '<td><p class="size"></p>' +
                            '<div class="progress"></div>' +
                            '</td>' +
                            '<td>' +
                            (!index && !o.options.autoUpload ?
                                '<button class="start" disabled>Start</button>' : '') +
                            (!index ? '<button class="cancel">Cancel</button>' : '') +
                            '</td>' +
                            '</tr>');
                        row.find('.name').text(file.name);
                        row.find('.size').text(o.formatFileSize(file.size));
                        if (file.error) {
                            row.find('.error').text(file.error);
                        }
                        rows = rows.add(row);
                    });
                    return rows;
                },
                downloadTemplate: function (o) {
                    var rows = $();
                    $.each(o.files, function (index, file) {
                        console.log(file);
                        var row = $('<tr class="template-download fade">' +
                            '<td><span class="preview"></span></td>' +
                            '<td><p class="name"></p>' +
                            (file.error ? '<div class="error ui-state-error ui-state-error-text"></div>' : 
                                '<div class="success ui-state-highlight"></div>') +
                            '</td>' +
                            '<td><span class="size"></span></td>' +
                            '<td><button class="delete">Delete</button></td>' +
                            '</tr>');
                        row.find('.size').text(o.formatFileSize(file.size));
                        if (file.error) {
                            row.find('.name').text(file.name);
                            row.find('.error').text(file.error);
                        } else {
                            row.find('.name').append($('<a></a>').text(file.name));
                            row.find('.success').text("上传成功");
                            if (file.thumbnailUrl) {
                                row.find('.preview').append(
                                    $('<a></a>').append(
                                        $('<img>').prop('src', file.thumbnailUrl)
                                    )
                                );
                            }
                            row.find('a')
                                .attr('data-gallery', '')
                                .prop('href', file.url);
                            row.find('button.delete')
                                .attr('data-type', file.delete_type)
                                .attr('data-url', file.delete_url);
                        }
                        rows = rows.add(row);
                    });
                    return rows;
                },
                getFilesFromResponse: function (data) {
                    var actual_url = external_pic_url + data.result.url;
                    var file = {
                        url : actual_url,
                        thumbnailUrl: actual_url + "!small",
                        name: data.result.url,
                        type: "image/" + data.result["image-type"],
                        // deleteUrl: upyun_api_url + data.result.url,
                        // deleteType: "DELETE"
                    };
                    return [file];
                },
            }
        );
        $('#fileupload').bind('fileuploadsubmit', function(e, data) {
            var ext = $('#fileupload').fileupload('option', 'imageType');
            var expiration = parseInt((new Date().getTime() + 3600000) / 1000);
            var options = {
                'bucket' : 'luominna',
                'save-key': '/{filemd5}{.suffix}',
                'expiration': expiration,
            };
            var policy = Base64.encode(JSON.stringify(options));
            var signature = calcSign(policy, "rw6iR7jKF5v61PV4UK0feptIEQ4=");
            data.formData = {
                policy: policy,
                signature: signature
            }
        });
        $('#fileupload').bind('fileuploaddone', function(e, data) {
            console.log(data.result);
            var actual_url = external_pic_url + data.result.url;
            $('#id_url').prop('value', actual_url);
            $('#id_img').prop('src', actual_url + "!preview");
        });
        // $('#fileupload').bind('fileuploadfail', function(e, data) {
        //     console.error(data.jqXHR.responseText);
        // });
    }
);
