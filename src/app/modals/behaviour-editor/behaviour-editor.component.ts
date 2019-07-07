import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as $ from '../../lib/jquery';
import * as droplet from '../../lib/droplet';
import * as palette from '../../lib/palette';
//import * as tooltipster from '../../lib/tooltipster/js/jquery.tooltipster';

@Component({
  selector: 'app-behaviour-editor',
  templateUrl: './behaviour-editor.component.html',
  styleUrls: ['./behaviour-editor.component..scss']
})
export class BehaviourEditorComponent implements OnInit, OnDestroy {

  behaviourName: string;
  code: string;
  callbacks = {};
  pane;
  subscribers = [];
  mimeType = 'text/javascript';
  dropletEditor;

  constructor(public modal: NgbActiveModal) {
    this.behaviourName = '';
  }

  public init(behaviourName: string, existingScript?: string): void {
    this.behaviourName = behaviourName;
    if (existingScript) {
      this.code = existingScript;
    } else {
      this.code = this.initBehaviourCode();
    }
  }

  ngOnInit() {
    this.pane = this.initialPaneState();
    var pane = $('.left').find('.pane').attr('id');
    var doc = {
      data: this.code
    };
    var mpp = this.pane;
    //if (!doc.file) { doc.file = 'setdoc'; }
    mpp.isdir = false;
    mpp.data = doc;
    //var mode = doc.hasOwnProperty('blocks') ?
    //    !falsish(doc.blocks) : loadBlockMode();
    var mode = 'hybrid';
    var filename = '';
    mpp.filename = filename;
    mpp.isdir = false;
    mpp.bydate = false;
    //mpp.loading = nextLoadNumber();
    mpp.running = false;
    this.setPaneEditorData(pane, doc, filename, mode);
  }

  ngOnDestroy() {
    this.dropletEditor.aceEditor.destroy();
    delete this.dropletEditor.aceEditor;
    delete this.dropletEditor;
    this.dropletEditor = null;
    this.pane = null;
  }

  initialPaneState() {
    return {
      editor: null,       // The ace editor instance.
      changeHandler: null,// A closure listening to changes.
      cleanText: null,    // The last-saved copy of the text.
      cleanLineCount: 0,  // The last-run number of lines of text.
      marked: {},         // Tracks highlighted lines (see markPaneEditorLine)
      mimeType: null,     // The current mime type.
      dirtied: false,     // Set if known to be dirty.
      links: null,        // Unused in this mode.
      running: false      // Unused in this mode.
    };
  }

  private initBehaviourCode(): string {
    let code: string = 'class Behaviour' + this.behaviourName + ' {\n';
    code += '\tconstructor(owner) {\n';
    code += '\t\tthis.name = \'' + this.behaviourName + '\';\n';
    code += '\t\tthis.properties = [];\n';
    code += '\t\tthis.attachedObject = owner;\n';
    code += '\t}\n\n';
    code += '\tinit(runtimeService) {\n';
    code += '\t\t// Code here will run once when the object is created.\n';
    code += '\t\t\n';
    code += '\t}\n\t\t\n';
    code += '\tupdate(runtimeService) {\n';
    code += '\t\t// Code here will run every frame (about 60 times every second).\n';
    code += '\t\t\n';
    code += '\t}\n\t\t\n';
    code += '\tdraw(runtimeService) {\n';
    code += '\t\t// Advanced use - rendering specific code. Runs every frame after update.\n';
    code += '\t\t// Most people will not need to write any code here.\n';
    code += '\t\t\n';
    code += '\t}\n\t\t\n';
    code += '\tgetAttachedObject() {\n';
    code += '\t\treturn this.attachedObject;\n';
    code += '\t}\n\n';
    code += '}\n\n';
    code += 'module.exports = Behaviour' + this.behaviourName + ';';
    return code;
  }

  public getPaneEditorData() {
    var paneState = this.pane;
    if (!paneState.editor) {
      return null;
    }
    var text = paneState.dropletEditor.getValue();
    //text = normalizeCarriageReturns(text);
    //updateMeta(paneState);
    //var metaCopy = copyJSON(paneState.meta);
    return {data: text, mime: paneState.mimeType/*, meta: metaCopy*/ };
  }

  fireEvent(tag, args) {
    if (tag in this.callbacks) {
      var cbs = this.callbacks[tag].slice();
      //take a copy of the array in case other 
      //events are fired while you're indexing it.
      for (let j = 0; j < cbs.length; j++) {
        var cb = cbs[j];
        if (cb) {
          cb.apply(null, args);
        }
      }
    }
  }

  paletteForPane(paneState) {
    var //mimeType = editorMimeType(paneState).replace(/;.*$/, ''),
        basePalette = paneState.palette;
    if (!basePalette) {
      if (this.mimeType == 'text/x-pencilcode' || this.mimeType == 'text/coffeescript') {
        basePalette = palette.COFFEESCRIPT_PALETTE;
      }
      if (this.mimeType == 'text/javascript' ||
          this.mimeType == 'application/x-javascript') {
        basePalette = palette.JAVASCRIPT_PALETTE;
      }
      if (this.mimeType == 'text/html') {
        basePalette = palette.HTML_PALETTE;
      }
      if (this.mimeType == 'text/typescript') {
        basePalette = palette.TYPESCRIPT_PALETTE;
      }
    }
    if (basePalette) {
      return palette.expand(basePalette, paneState.selfname);
    }
    return [];
  }

  dropletOptionsForMimeType(mimeType) {
    if (mimeType.match(/^text\/html\b/)) {
      return {
        tags: palette.KNOWN_HTML_TAGS
      };
    } else {
      return {
        functions: palette.KNOWN_FUNCTIONS,
        categories: palette.CATEGORIES
      };
    }
  }

  // Initializes an (ACE) editor into a pane, using the given text and the
  // given filename.
  // @param pane the id of a pane - alpha, bravo or charlie.
  // @param text the initial text to edit.
  // @param filename the filename to use.
  setPaneEditorData(pane, doc, filename, useblocks) {
    //clearPane(pane);
    let self = this;

    //var text = normalizeCarriageReturns(doc.data);
    var text = doc.data;
    //var meta = copyJSON(doc.meta);
    var paneState = this.pane;
    paneState.filename = filename;
    //paneState.mimeType = filetype.mimeForFilename(filename);
    paneState.cleanText = text;
    //paneState.cleanMeta = JSON.stringify(meta);
    paneState.dirtied = false;
    //paneState.meta = meta;
    paneState.settingUp = true;
    //var visibleMimeType = editorMimeType(paneState);
    //if (!mimeTypeSupportsBlocks(visibleMimeType)) {
    //  useblocks = false;
    //}
    //var id = uniqueId('editor');
    var id = 'code-editor';
    /*var layout = [
      '<div class="hpanelbox">',
      '<div class="hpanel">',
      '<div id="' + id + '" class="editor"></div>',
      '</div>',
      '<div class="hpanel cssmark" style="display:none" share="25">',
      '</div>',
      '<div class="hpanel htmlmark" style="display:none" share="25">',
      '</div>'
    ];*/
    //var box = $('#' + pane).html(layout.join(''));
    //sizeHtmlCssPanels(pane);

    // Set up the main editor.
    //var dropletMode = dropletModeForMimeType(visibleMimeType);
    this.dropletEditor = paneState.dropletEditor =
        new droplet.Editor(
            document.getElementById(id),
            {
              mode: 'javascript',
              palette: this.paletteForPane(paneState),
              modeOptions: this.dropletOptionsForMimeType(this.mimeType)
            });
    // Set up fonts - once they are loaded.
    //whenCodeFontLoaded(function () {
    //  dropletEditor.setFontFamily("Source Code Pro");
    //  dropletEditor.setFontSize(15);
    //});
    this.dropletEditor.setPaletteWidth(400);
    //if (!/^frame\./.test(window.location.hostname)) {
      // Blue nubby when inside pencilcode.
    //  dropletEditor.setTopNubbyStyle(0, '#1e90ff');
    //} else {
      // Gray nubby when framed.
      this.dropletEditor.setTopNubbyStyle(0, '#dddddd');
    //}
    // Listen to parseerror event before setting up text.
    this.dropletEditor.on('parseerror', function(e) {
      self.fireEvent('parseerror', [pane, e]);
    });
    this.dropletEditor.setEditorState(useblocks);
    //this.dropletEditor.setValue(text);

    // show blocks in text editor view
    //if (state.studyCondition == 'hybrid') {
      this.dropletEditor.showPaletteInTextMode = true; 
      // melt from blocks to text, but do so very quickly
      this.dropletEditor.performMeltAnimation(1, 1);
    //}

    this.dropletEditor.on('changepalette', function() {
      //$('.droplet-hover-div').tooltipster({position: 'right', interactive: true});
    });


    // bubble up droplet events to pencil code
    this.dropletEditor.on('selectpalette', function(p) {
      self.fireEvent('selectpalette', [pane, p]);
    });
    this.dropletEditor.on('pickblock', function(p) {
      self.fireEvent('pickblock', [pane, p]);
    });
    this.dropletEditor.on('block-drop', function(p) {
      self.fireEvent('block-drop', [pane, p]);
    });

    this.dropletEditor.on('linehover', function(ev) {
      self.fireEvent('icehover', [pane, ev]);
    });

    //paneState.lastChangeTime = +(new Date);

    this.dropletEditor.on('change', function() {
      if (paneState.settingUp) return;
      paneState.lastChangeTime = +(new Date);
      self.fireEvent('dirty', [pane]);
      //if (hasSubscribers()) publish('update', [dropletEditor.getValue()]);
      this.dropletEditor.clearLineMarks();
      self.fireEvent('changelines', [pane]);
      self.fireEvent('delta', [pane]);
    });

    this.dropletEditor.on('toggledone', function() {
      //if (!$('.droplet-hover-div').hasClass('tooltipstered')) {
      //  $('.droplet-hover-div').tooltipster();
      //}
      //updatePaneTitle(pane);
    });

    /*if (!/^frame\./.test(window.location.hostname)) {
      $('<div class="blockmenu">Blocks' +
        '<span class="blockmenuarrow">&#9660;</span></div>').appendTo(
          dropletEditor.paletteWrapper);
    }*/

    $('<div class="texttoggle">' +
      '<div class="slide"><div class="info"></div></div></div>').appendTo(
        this.dropletEditor.paletteWrapper);
    $('<div class="blocktoggle">' +
      '<div class="slide"><div class="info"></div></div></div>').appendTo(
        $(this.dropletEditor.wrapperElement).find('.ace_editor'));

    var mainContainer = $('#' + id);

    //setupResizeHandler(mainContainer.parent(), dropletEditor);
    var editor = paneState.editor = this.dropletEditor.aceEditor;
    var um = editor.getSession().getUndoManager();
    //setPrimaryFocus();

    this.setupAceEditor(pane, mainContainer, editor,
      //modeForMimeType(editorMimeType(paneState)), text);
      'ace/mode/javascript', text);
    var session = editor.getSession();
    session.on('change', function() {
      // Any editing that changes the line count ends the debugging session.
      paneState.lastChangeTime = +(new Date);
      if (paneState.cleanLineCount != session.getLength()) {
        self.clearPaneEditorMarks(pane, null);
        self.fireEvent('changelines', [pane]);
      }
      self.fireEvent('delta', [pane]);
    });

    um.reset();
    this.publish('update', [text], null);
    editor.getSession().setUndoManager(um);

    var gutter = mainContainer.find('.ace_gutter');
    gutter.on('mouseenter', '.guttermouseable', function(event) {
      self.fireEvent('entergutter', [pane, parseInt($(event.target).text())]);
    });
    gutter.on('mouseleave', '.guttermouseable', function(event) {
      self.fireEvent('leavegutter', [pane, parseInt($(event.target).text())]);
    });
    gutter.on('click', '.guttermouseable', function(event) {
      self.fireEvent('clickgutter', [pane, parseInt($(event.target).text())]);
    });

    var htmlCssChangeTimer = null;
    var htmlCssRetryCounter = 10;
    function handleHtmlCssChange() {
      htmlCssRetryCounter = 10;
      if (htmlCssChangeTimer) {
        clearTimeout(htmlCssChangeTimer);
      }
      htmlCssChangeTimer = setTimeout(checkForHtmlCssChange, 500);
      self.fireEvent('delta', [pane]);
    }
    function checkForHtmlCssChange() {
      htmlCssChangeTimer = null;
      if (self.editorHasAnyErrors(paneState.htmlEditor) ||
          self.editorHasAnyErrors(paneState.cssEditor)) {
        if (htmlCssRetryCounter > 0) {
          htmlCssRetryCounter -= 1;
          htmlCssChangeTimer = setTimeout(checkForHtmlCssChange, 1000);
        }
        return;
      }
      paneState.lastChangeTime = +(new Date);
      self.fireEvent('changehtmlcss', [pane]);
    }
    paneState.handleHtmlCssChange = handleHtmlCssChange;

    /*if (box.find('.htmlmark').is(':visible')) {
      setupSubEditor(box, pane, paneState, meta.html, 'html');
    }

    if (box.find('.cssmark').is(':visible')) {
      setupSubEditor(box, pane, paneState, meta.css, 'css');
    }

    paneState.settingUp = null;
    updatePaneTitle(pane);*/

    // Work around undesired scrolling bug -
    // repro: turn off split pane view, and linger over a file to force preload.
    $('#overflow').scrollLeft(0);
    this.dropletEditor.setValue(text);
  }

  setupAceEditor(pane, elt, editor, mode, text) {
    let self = this;
    //fixRepeatedCtrlFCommand(editor);
    editor.setTheme("ace/theme/chrome");
    editor.setBehavioursEnabled(false);
    editor.setHighlightActiveLine(false);
    editor.getSession().setFoldStyle('markbeginend');
    editor.getSession().setUseWrapMode(true);
    editor.getSession().setTabSize(2);
    editor.getSession().setMode(mode);
  
    // Set up sensitivity to touch events - this makes it so
    // that a brief touch brings up the editor.
    /*$(elt).find('.ace_content').on('touchstart', function(e) {
      // Unwrap jquery event.
      if (e.originalEvent) { e = e.originalEvent; }
      if (e.touches.length) {
        // The renderer really expects screen (scrolled) coordinates,
        // not page coordinates.
        var rc = editor.renderer.screenToTextCoordinates(
          e.touches[0].pageX - window.pageXOffset,
          e.touches[0].pageY - window.pageYOffset);
        editor.moveCursorToPosition(rc);
      }
      if (!editor.isFocused()) {
        // A single touch will focus the editor and bring up
        // the onscreen keyboard.
        editor.focus();
      } else {
        // If already focused, a touch will just move the cursor
        // but not blur focus nor dismiss the onscreen keyboard.
        e.preventDefault();
        return false;
      }
    });
    $(elt).find('.ace_editor').on('mouseup', function(e) {
      if ($(e.target).closest('.ace_search').length) {
        return;
      }
      if (!editor.isFocused() || !document.hasFocus()) {
        // On IE, if you click outside the window and click back,
        // you can be in a state where the editor can't focus itself.
        // The solution is to focus a different element, then focus
        // the editor after a short delay.
        $('body').focus();
        setTimeout(function() { editor.focus(); }, 0);
      }
    });*/
  
    var lineArr = text.split('\n');
    var lines = lineArr.length;
    var dimensions = this.getTextRowsAndColumns(text);
    // A big font char is 14 pixels wide and 29 pixels high.
    var big = { width: 14, height: 29 };
    // We're "long" if we bump out of the pane rectangle.
    var long = ((dimensions.rows + 2) * big.height > elt.height() ||
                (dimensions.columns + 5) * big.width > elt.width());
    if (long) {
      // Use a small font for long documents.
      $(elt).css({lineHeight: '119%'});
      editor.setFontSize(15);
    } else {
      // Use a giant font for short documents.
      $(elt).css({lineHeight: '121%'});
      editor.setFontSize(24);
    }
    var paneState = this.pane;
    /*var changeHandler = (function changeHandler() {
      if (changeHandler.suppressChange ||
          (paneState.dropletEditor &&
           paneState.dropletEditor.suppressAceChangeEvent)) {
        return;
      }
      if (paneState.settingUp) return;
      // Add an empty last line on a timer, because the editor doesn't
      // return accurate values for contents in the middle of the change event.
      setTimeout(function() { ensureEmptyLastLine(editor); }, 0);
      var session = editor.getSession();
      // Flip editor to small font size when it doesn't fit any more.
      if (editor.getFontSize() > 15) {
        var long = (session.getLength() * big.height > elt.height());
        if (!long) {
          // Scan for wrapped lines.
          for (var j = 0; j < session.getLength(); ++j) {
            if (session.getRowLength(j) > 1) {
              long = true;
              break;
            }
          }
        }
        if (long) {
          editor.setFontSize(15);
          $('#' + pane + ' .editor').css({lineHeight: '119%'});
        }
      }
      if (!paneState.dirtied) {
        paneState.lastChangeTime = +(new Date);
        fireEvent('dirty', [pane]);
      }
      if (/^text\/html|^image\/svg/.test(paneState.mimeType)) {
        handleHtmlChange();
      }
      // Publish the update event for hosting frame.
      if (hasSubscribers()) publish('update', [session.getValue()]);
    });*/
    //$(elt).data('changeHandler', changeHandler);
    //editor.getSession().on('change', changeHandler);
    // Fold any blocks with a line that ends with "# fold" or "// fold"
    function autoFold() {
      editor.getSession().off('tokenizerUpdate', autoFold);
      var foldMarker = /(?:#|\/\/)\s*fold$/;
      for (var i = 0, line; (line = lineArr[i]) !== undefined; i++) {
        var match = foldMarker.exec(line);
        if (match) {
          var data = editor.getSession().getParentFoldRangeData(i + 1);
          if (data && data.range && data.range.start && data.range.end) {
            editor.getSession().foldAll(data.range.start.row, data.range.end.row);
          } else if (match.index == 0) {
            // If the # fold is not in a block and is at the 0th column,
            // then use it as an indicator to fold all the blocks in the file.
            editor.getSession().foldAll(0, lineArr.length);
            return;
          }
        }
      }
    }
    //editor.getSession().on('tokenizerUpdate', autoFold);
    if (long) {
      editor.gotoLine(0);
    } else {
      editor.gotoLine(editor.getSession().getLength(), 0);
    }
    editor.on('focus', function() {
      var style = editor.container.style;
      if (parseInt(style.left) < -parseInt(style.width) ||
          parseInt(style.top) < -parseInt(style.height)) {
        // Do not pay attention to focus if the editor is positioned offscreen.
        return;
      }
      self.fireEvent('editfocus', [pane]);
    });
    // Fix focus bug after focus is stolen by a peer frame.
    // For example, activity.pencilcode.net/edit/frog/README.html:
    // after running it, a subframe of the RHS grabs focus and then
    // it becomes impossible to focus the ace editor by clicking on
    // it, without blurring it first.
    editor.on('click', function() {
      if (!editor.isFocused() && !editor.getReadOnly()) {
        editor.blur();
        editor.focus();
      }
    });
    // Also special-case html change handling.
    var htmlChangeTimer = null;
    var htmlChangeRetryCounter = 10;
    /*function handleHtmlChange() {
      htmlRetryCounter = 10;
      if (htmlChangeTimer) {
        clearTimeout(htmlChangeTimer);
      }
      htmlChangeTimer = setTimeout(checkForHtmlChange, 500);
    }
    function checkForHtmlChange() {
      htmlChangeTimer = null;
      if (!/^text\/html|^image\/svg/.test(paneState.mimeType)) {
        return;
      }
      if (editorHasAnyErrors(paneState.editor)) {
        if (htmlRetryCounter > 0) {
          htmlRetryCounter -= 1;
          htmlChangeTimer = setTimeout(checkForHtmlChange, 1000);
        }
        return;
      }
      paneState.lastChangeTime = +(new Date);
      fireEvent('changehtmlcss', [pane]);
    }*/
  }

  getTextRowsAndColumns(text) {
    var rawlines = text.split('\n');
    var columns = 0;
    for (var j = 0; j < rawlines.length; ++j) {
      columns = Math.max(columns, rawlines[j].length);
    }
    return {
      rows: rawlines.length,
      columns: columns
    };
  }

  // Clears all marks of the given class.
  // If no markclass is passed, clears all marks of all classes.
  clearPaneEditorMarks(pane, markclass) {
    var paneState = this.pane;
    if (!paneState.editor) {
      return;
    }
    if (!markclass) {
      for (markclass in paneState.marked) {
        if (markclass) {
          this.clearPaneEditorMarks(pane, markclass);
        }
      }
      return;
    }
    var idMap = paneState.marked[markclass];
    var session = paneState.editor.session;
    delete paneState.marked[markclass];
    if (idMap) {
      for (var zline in idMap) {
        if (/^gutter/.test(markclass)) {
          session.removeGutterDecoration(zline, markclass);
        } else {
          session.removeMarker(idMap[zline]);
        }
      }
    }
    paneState.dropletEditor.clearLineMarks(markclass);
  }

  publish(method, args, requestid){
    for (var j = 0; j < this.subscribers.length; ++j) {
      this.subscribers[j](method, args, requestid);
    }
  }

  editorHasAnyErrors(editor) {
    if (!editor) return false;
    var annot = editor.getSession().getAnnotations();
    for (var j = 0; j < annot.length; ++j) {
      if (annot[j].type == 'error')
        return true;
    }
    return false;
  }
}
