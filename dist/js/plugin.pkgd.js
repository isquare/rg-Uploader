!function(){RGUploader.prototype.plugins.changeQueueStyle=function(){var e="Change queue style",t=null,n=null,i=null,a=[{name:"list",title:"list style",iconName:"menu","default":!0},{name:"web",title:"web style",iconName:"view_list","default":!1},{name:"album",title:"album style",iconName:"view_module","default":!1}],r=function(){$.each(a,function(e,t){var i=$('<button type="button" class="style-'+t.name+'" title="'+t.title+'" data-style="'+t.name+'"><i class="material-icons">'+t.iconName+"</i></button>");u(i),n.append(i)}),i=n.children("button")},u=function(e){e.on("click",function(e){return!$(this).hasClass("on")&&void t.queue.changeStyle($(this).data("style"))})},l=function(e){i.removeClass("on").filter(".style-"+e).addClass("on")};return{name:e,init:function(e){t=e,n=$('<nav data-element="selectQueueStyle"></nav>'),t.$container.children("header").append(n),r(),l(t.queue.style)},eventListener:function(e,t){switch(e){case"queue.changeStyle":l(t.style)}}}}}(),function(){RGUploader.prototype.plugins.dnd=function(){var e="Drag and Drop upload",t=null,n=[],i=$(".rg-external-dropzone"),a=function(e){if(!(window.File&&window.FileList&&window.FileReader&&window.Blob))return!1;if(!e.length)return!1;for(var t=$.Deferred(),n=!1,i=function(e){if(e.stopPropagation(),e.preventDefault(),"dragover"==e.type){if(n)return!1;n=!0,$(e.currentTarget).addClass("drop-mode"),e.dataTransfer.dropEffect="copy"}else n=!1,$(e.currentTarget).removeClass("drop-mode");return!1},a=function(e){e.stopPropagation(),e.preventDefault(),i(e);var n=e.dataTransfer?e.dataTransfer.files:null;return n&&n.length&&t.notify(n),!1},r=0;r<e.length;r++)e[r].addEventListener("dragover",i,!1),e[r].addEventListener("dragleave",i,!1),e[r].addEventListener("drop",a,!1);return t.promise()},r=function(e){return t.uploader.uploading?(alert(t.lang("error_add_upload")),!1):void t.uploader.play(e||[])};return{name:e,init:function(e){if(t=e,n.push(t.queue.$queue.parent().get(0)),i.each(function(){n.push(this)}),n.length){var u=a(n);u&&u.progress&&u.progress(r)}}}}}(),function(){RGUploader.prototype.plugins.preview=function(){var e="preview",t=null,n=null,i="not-image",a=150,r=function(){var e='<div class="col preview"><figure></figure></div>';n=$(e),n.width(a),t.$container.find("[data-comp=queue]").prepend(n),u()},u=function(e){var t=n.children("figure");e?t.css("backgroundImage","url('"+e+"')").removeClass(i):t.attr("style","").addClass(i)},l=function(e){e?n.removeClass("hide"):n.addClass("hide")};return{name:e,init:function(e){t=e,a=parseInt(t.options.queue.height),r()},eventListener:function(e,n){switch(e){case"queue.selectQueue":var i=n.$selectElement.data("id"),a=t.queue.findItem(i),r=t.queue.items.files[a],o=n.$selectElement.hasClass("selected")&&"image"==r.type.split("/")[0]?r.src:null;u(o);break;case"queue.changeStyle":l("list"==n.style)}}}}}(),function(){RGUploader.prototype.plugins.sizeinfo=function(){var e="sizeinfo",t=null,n=null,i=".size-info",a=null,r=null,u={current:0,total:0},l=function(){a.text(t.util.bytesToSize(u.current)),r.text(t.util.bytesToSize(u.total))},o=function(){var e='<p>Size : <em data-text="currentSize"></em>/<em data-text="totalSize"></em></p>';n.append(e),a=n.find("[data-text=currentSize]"),r=n.find("[data-text=totalSize]")};return{name:e,init:function(a){t=a,n=a.$container.find(i),n.length||t.plugin.error(e),o(),u.total=t.options.limitSizeTotal,l()},update:l,eventListener:function(e,n){switch(e){case"queue.uploadComplete":u.current+=n.file.size,l(t.queue.getSize());break;case"queue.removeQueue":u.current=t.queue.getSize(),l()}}}}}(),function(){RGUploader.prototype.plugins.thumbnail=function(){var e="Create thumnail image",t=null;return{name:e,init:function(n){t=n,log(e)},open:function(){},eventListener:function(e,t){switch(e){case"":}}}}}();
//# sourceMappingURL=maps/plugin.pkgd.js.map