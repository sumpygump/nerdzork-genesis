const GenesisForm = {
    catalog: {
        rooms: {},
        doodads: {},
    },
    init: function() {
        this.bind();
    },
    bind: function() {
        const self = this;
        $('.js-add-room').on('click', function(e) {
            e.preventDefault();
            self.addRoom(true);
        });
        $('.js-add-doodad').on('click', function(e) {
            e.preventDefault();
            self.addDoodad(true);
        });

        $(document).on('click', '.js-add-room-doodad', function(e) {
            e.preventDefault();
            self.addRoomDoodad(this, true);
        });
        $(document).on('click', '.js-add-room-exit', function(e) {
            e.preventDefault();
            self.addRoomExit(this, true);
        });
        $(document).on('click', '.js-add-doodad-interaction', function(e) {
            e.preventDefault();
            self.addDoodadInteraction(this, true);
        });

        $(document).on('click', '.js-remove-sub-form', function(e) {
            e.preventDefault();
            self.removeSubform(this);
        });
        $(document).on('click', '.js-remove-sub-form-item', function(e) {
            e.preventDefault();
            self.removeSubformItem(this);
        });

        $('.js-load-json').on('click', function(e) {
            if ($(this).attr('disabled')) {
                return false;
            }
            e.preventDefault();
            self.loadJson($('#json_input').val());
        });

        $('.js-export-puzzle').on('click', function(e) {
            e.preventDefault();
            self.exportJson();
        });

        $('.tabs-input').on('change', function(e) {
            const panel = $(this).data('panel');
            $('.panel').hide();
            $("#" + panel).show();
            GridForms.init();
        });

        $(document).on('change', '.fieldset-master', function(e) {
            self._updateSelects();
        });

        $('#rooms_select').on('change', function(e) {
            if ($(this).val() == "") {
                self.showAllRooms();
            } else {
                self.showOnlyRoom($(this).val());
            }
        });

        $('#doodads_select').on('change', function(e) {
            if ($(this).val() == "") {
                self.showAllDoodads();
            } else {
                self.showOnlyDoodad($(this).val());
            }
        });

        $(document).on('change', '[data-related]', function(e) {
            self._updateRelationHints();
        });
        $(document).on('click', '.hint', function(e) {
            const rel = $(this).siblings('input');
            if (rel.data('related') == 'room_slug') {
                const newRoom = self.addRoom(false);
                newRoom.find('[name=room_slug]').val(rel.val());
                newRoom.hide();
            }
            if (rel.data('related') == 'doodad_slug') {
                const newDoodad = self.addDoodad(false);
                newDoodad.find('[name=doodad_slug]').val(rel.val());
                newDoodad.hide();
            }
            $(this).hide();
            self._updateSelects();
        });
    },
    showAllRooms: function() {
        for (var id in this.catalog.rooms) {
            $(this.catalog.rooms[id]).show();
        }
        GridForms.init();
    },
    hideAllRooms: function() {
        for (var id in this.catalog.rooms) {
            $(this.catalog.rooms[id]).hide();
        }
    },
    showOnlyRoom: function(id) {
        this.hideAllRooms();
        $(this.catalog.rooms[id]).show();
        GridForms.init();
    },
    showAllDoodads: function() {
        for (var id in this.catalog.doodads) {
            $(this.catalog.doodads[id]).show();
        }
        GridForms.init();
    },
    hideAllDoodads: function() {
        for (var id in this.catalog.doodads) {
            $(this.catalog.doodads[id]).hide();
        }
    },
    showOnlyDoodad: function(id) {
        this.hideAllDoodads();
        $(this.catalog.doodads[id]).show();
        GridForms.init();
    },
    _updateRelationHints: function() {
        // Gather all the current slugs
        roomSlugs = [];
        for (var id in this.catalog.rooms) {
            var slug = $(this.catalog.rooms[id]).find('[name=room_slug]').val();
            roomSlugs.push(slug);
        }
        doodadSlugs = [];
        for (var id in this.catalog.doodads) {
            var slug = $(this.catalog.doodads[id]).find('[name=doodad_slug]').val();
            doodadSlugs.push(slug);
        }

        // Check relations in room exits and room doodads
        for (var id in this.catalog.rooms) {
            var rels = $(this.catalog.rooms[id]).find('[data-related=room_slug]');
            rels.each(function() {
                var hint = $(this).siblings('.hint');
                if ($(this).val() !== "" && !roomSlugs.includes($(this).val())) {
                    hint.show();
                } else {
                    hint.hide();
                }
            });
            var rels = $(this.catalog.rooms[id]).find('[data-related=doodad_slug]');
            rels.each(function() {
                var hint = $(this).siblings('.hint');
                if ($(this).val() !== "" && !doodadSlugs.includes($(this).val())) {
                    hint.show();
                } else {
                    hint.hide();
                }
            });
        }

        // Check relations in doodad interactions
        for (var id in this.catalog.doodads) {
            var rels = $(this.catalog.doodads[id]).find('[data-related=room_slug]');
            rels.each(function() {
                var hint = $(this).siblings('.hint');
                if ($(this).val() !== "" && !roomSlugs.includes($(this).val())) {
                    hint.show();
                } else {
                    hint.hide();
                }
            });
            var rels = $(this.catalog.doodads[id]).find('[data-related=doodad_slug]');
            rels.each(function() {
                var hint = $(this).siblings('.hint');
                if ($(this).val() !== "" && !doodadSlugs.includes($(this).val())) {
                    hint.show();
                } else {
                    hint.hide();
                }
            });
        }
    },
    makeId: function(obj_type) {
        return obj_type + "_" + Date.now();
    },
    addRoom: function(interactive) {
        var newRoom = $(RoomForm).appendTo('#rooms_container');
        const room_id = this.makeId('room');
        $(newRoom).data('id', room_id);
        $(newRoom).data('category', 'rooms');
        this.catalog.rooms[room_id] = newRoom;
        this._updateSelects();

        if (interactive) {
            if ($('#rooms_select').val() != "") {
                this.hideAllRooms();
                newRoom.show();
                $('#rooms_select').val(doodad_id);
            }
            this.scrollTo(newRoom);
            newRoom.find('.focus').focus();
            GridForms.init();
        }
        return newRoom;
    },
    addRoomDoodad: function(el, interactive) {
        var newRoomDoodad = $(RoomDoodadForm).appendTo($(el).parents('.room-doodad-list'));
        GridForms.init();
        if (interactive) {
            newRoomDoodad.find('.focus').focus();
        }
        return newRoomDoodad;
    },
    addRoomExit: function(el, interactive) {
        var newRoomExit = $(RoomExitForm).appendTo($(el).parents('.room-exit-list'));
        GridForms.init();
        if (interactive) {
            newRoomExit.find('.focus').focus();
        }
        return newRoomExit
    },
    addDoodad: function(interactive) {
        var newDoodad = $(DoodadForm).appendTo('#doodads_container');
        const doodad_id = this.makeId('doodad');
        $(newDoodad).data('id', doodad_id);
        $(newDoodad).data('category', 'doodads');
        this.catalog.doodads[doodad_id] = newDoodad;
        this._updateSelects();

        if (interactive) {
            if ($('#doodads_select').val() != "") {
                this.hideAllDoodads();
                newDoodad.show();
                $('#doodads_select').val(doodad_id);
            }
            this.scrollTo(newDoodad);
            newDoodad.find('.focus').focus();
            GridForms.init();
        }
        return newDoodad;
    },
    addDoodadInteraction: function(el, interactive) {
        var newDoodadInteraction = $(DoodadInteractionForm).appendTo($(el).parents('.doodad-interactions-list'));
        GridForms.init();
        if (interactive) {
            newDoodadInteraction.find('.focus').focus();
        }
        return newDoodadInteraction;
    },
    removeSubform: function(el) {
        const subform = $(el).parents('.sub-form').eq(0);
        delete this.catalog[subform.data('category')][subform.data('id')];
        this._updateSelects();
        this._updateRelationHints();

        // Revert back to showing all
        if (subform.data('category') == 'rooms') {
            $('#rooms_select').val('');
            this.showAllRooms();
        } else {
            $('#doodads_select').val('');
            this.showAllDoodads();
        }

        subform.slideUp(200, function(){$(this).remove()});
    },
    removeSubformItem: function(el) {
        $(el).parents('.sub-form-item').eq(0).slideUp(200, function(){$(this).remove()});
    },
    scrollTo: function(el) {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(el).offset().top
        }, 30);
    },
    _finishedLoadingMessage: function(message, should_auto_clear) {
        setTimeout(function() {
            $('.js-load-json').removeAttr('disabled').removeClass('running');
            $('#load_message').text(message);
        }, 500);

        if (should_auto_clear) {
            const self = this;
            setTimeout(function() {
                self._clearLoadingMessage();
            }, 5000);
        }
    },
    _clearLoadingMessage: function() {
        $('#load_message').text('');
    },
    _updateSelects: function() {
        const $rs = $('#rooms_select');
        const $ds = $('#doodads_select');

        const selected_room = $rs.val();
        const selected_doodad = $ds.val();

        $rs.html('<option value="">--</option>');
        for (var id in this.catalog.rooms) {
            slug = this.catalog.rooms[id].find('[name=room_slug]').val();
            $rs.append('<option value="' + id + '">' + slug + '</option>');
        }
        $rs.val(selected_room);

        $ds.html('<option value="">--</option>');
        for (var id in this.catalog.doodads) {
            slug = this.catalog.doodads[id].find('[name=doodad_slug]').val();
            $ds.append('<option value="' + id + '">' + slug + '</option>');
        }
        $ds.val(selected_doodad);
    },
    loadJson: function(content) {
        const self = this;
        $('.js-load-json').attr('disabled', 'disabled').addClass('running');
        this._clearLoadingMessage();

        if (content.trim() == "") {
            this._finishedLoadingMessage("No JSON data to parse.");
            return false;
        }
        try {
            puzzle = JSON.parse(content);
        } catch (e) {
            this._finishedLoadingMessage("Error loading JSON data. " + e);
            return false;
        }

        setTimeout(function() {
            self.setFormData(puzzle);
            self._updateSelects();
            self._updateRelationHints();
        }, 10);
    },
    resetForm: function() {
        this.set('name', '');
        this.set('slug', '');
        this.set('description', '');
        this.set('entranceRoomSlug', '');
        this.set('exitRoomSlug', '');
        this.set('validationOnly', true);
        $('.sub-form').remove();

        this.catalog = {rooms:{}, doodads:{}};
    },
    setFormData: function(puzzle) {
        this.resetForm();

        this.set('name', puzzle.name);
        this.set('slug', puzzle.slug);
        this.set('description', puzzle.description);
        this.set('entranceRoomSlug', puzzle.entranceRoomSlug);
        this.set('exitRoomSlug', puzzle.exitRoomSlug);
        this.set('validationOnly', puzzle.validationOnly == true ? "true" : "false");

        for (var index in puzzle.rooms) {
            room = puzzle.rooms[index];
            rf = this.addRoom();
            this.setIn(rf, 'room_slug', room.slug);
            this.setIn(rf, 'room_description', room.description);

            for (var dindex in room.doodads) {
                doodad = room.doodads[dindex];
                df = this.addRoomDoodad(rf.find('.js-add-room-doodad'));
                this.setIn(df, 'room_doodad_doodadSlug', doodad.doodadSlug);
                isGettableValue = "false";
                if (doodad.isGettable) {
                    isGettableValue = "true";
                }
                this.setIn(df, 'room_doodad_isGettable', isGettableValue);
                this.setIn(df, 'room_doodad_lookMessage', doodad.lookMessage);
            }

            for (var eindex in room.exits) {
                exit = room.exits[eindex];
                moveFailKillsValue = "false";
                if (exit.moveFailKills) {
                    moveFailKillsValue = "true";
                }
                ef = this.addRoomExit(rf.find('.js-add-room-exit'));
                this.setIn(ef, 'room_exit_direction', exit.direction);
                this.setIn(ef, 'room_exit_exitRoomSlug', exit.exitRoomSlug);
                this.setIn(ef, 'room_exit_lookMessage', exit.lookMessage);
                this.setIn(ef, 'room_exit_visibilityDoodadSlug', exit.visibilityDoodadSlug);
                this.setIn(ef, 'room_exit_requiredDoodadSlug', exit.requiredDoodadSlug);
                this.setIn(ef, 'room_exit_moveFailKills', moveFailKillsValue);
                this.setIn(ef, 'room_exit_failMessage', exit.failMessage);
                this.setIn(ef, 'room_exit_publicFailMessage', exit.publicFailMessage);
            }
        }

        for (var index in puzzle.doodads) {
            doodad = puzzle.doodads[index];
            df = this.addDoodad();
            this.setIn(df, 'doodad_slug', doodad.slug);
            this.setIn(df, 'doodad_inspectDescription', doodad.inspectDescription);
            this.setIn(df, 'doodad_inventoryMessage', doodad.inventoryMessage);

            for (var iindex in doodad.interactions) {
                interaction = doodad.interactions[iindex];
                inf = this.addDoodadInteraction(df.find('.js-add-doodad-interaction'));
                this.setIn(inf, 'doodad_interaction_interactionType', interaction.interactionType);
                this.setIn(inf, 'doodad_interaction_successMessage', interaction.successMessage);
                this.setIn(inf, 'doodad_interaction_failMessage', interaction.failMessage);
                this.setIn(inf, 'doodad_interaction_publicFailMessage', interaction.publicFailMessage);
                this.setIn(inf, 'doodad_interaction_requiredDoodadSlug', interaction.requiredDoodadSlug);
                this.setIn(inf, 'doodad_interaction_requiredDoodadAlreadyUsed', interaction.requiredDoodadAlreadyUsed);
                this.setIn(inf, 'doodad_interaction_successSpawnDoodadSlug', interaction.successSpawnDoodadSlug);
                this.setIn(inf, 'doodad_interaction_successTeleportRoomSlug', interaction.successTeleportRoomSlug);
            }
        }

        this._finishedLoadingMessage("Successfully loaded JSON data.", true);
    },
    set: function(name, value) {
        $('[name=' + name + ']').val(value);
    },
    setIn: function(el, name, value) {
        $(el).find('[name=' + name + ']').val(value);
    },
    exportJson: function() {
        if ($('input[name=slug]').val().trim() == "") {
            alert("Puzzle slug is required.");
            $('input[name=slug]').focus();
            return false;
        }
        formData = $('form').serializeArray();
        puzzle = Puzzle.serialize(formData);
        this.download(puzzle.slug + ".json", JSON.stringify(puzzle, null, "  "));
    },
    download: function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
};

const Puzzle = {
    cursors: {
        room: 0,
        roomDoodad: 0,
        roomExit: 0,
        doodad: 0,
        doodadInteraction: 0
    },
    serialize: function(formData) {
        var puzzle = {
            slug: "",
            name: "",
            description: "",
            entranceRoomSlug: "",
            exitRoomSlug: "",
            validationOnly: "",
            rooms: [],
            doodads: []
        };

        for (i in formData) {
            field = formData[i];
            if (field.value == "true") {
                field.value = true;
            }
            if (field.value == "false") {
                field.value = false;
            }

            if (field.name.startsWith("room_")) {
                this._attachRoomField(puzzle, field);
            } else if (field.name.startsWith("doodad_")) {
                this._attachDoodadField(puzzle, field);
            } else {
                if (field.name != "tabs") {
                    puzzle[field.name] = field.value;
                }
            }
        }

        return puzzle;
    },
    _attachRoomField: function(puzzle, field) {
        if (field.name == "room_slug") {
            var length = puzzle.rooms.push(
                {slug: field.value, doodads: [], exits: []}
            );
            this.cursors.room = length - 1;
        } else {
            if (field.name.startsWith("room_doodad_")) {
                fieldName = field.name.split("_")[2];
                if (fieldName == "doodadSlug") {
                    var length = puzzle.rooms[this.cursors.room]["doodads"].push({doodadSlug: field.value});
                    this.cursors.roomDoodad = length - 1;
                } else {
                    if (field.value == "") {
                        return;
                    }
                    puzzle.rooms[this.cursors.room]["doodads"][this.cursors.roomDoodad][fieldName] = field.value;
                }
            } else if (field.name.startsWith("room_exit_")) {
                fieldName = field.name.split("_")[2];
                if (fieldName == "direction") {
                    var length = puzzle.rooms[this.cursors.room]["exits"].push({direction: field.value});
                    this.cursors.roomExit = length - 1;
                } else {
                    if (field.value == "") {
                        return;
                    }
                    puzzle.rooms[this.cursors.room]["exits"][this.cursors.roomExit][fieldName] = field.value;
                }
            } else {
                fieldName = field.name.split("_")[1];
                puzzle.rooms[this.cursors.room][fieldName] = field.value;
            }
        }
    },
    _attachDoodadField: function(puzzle, field) {
        if (field.name == "doodad_slug") {
            var length = puzzle.doodads.push(
                {slug: field.value, interactions: []}
            );
            this.cursors.doodad = length - 1;
        } else {
            if (field.name.startsWith("doodad_interaction_")) {
                fieldName = field.name.split("_")[2];
                if (fieldName == "interactionType") {
                    var length = puzzle.doodads[this.cursors.doodad]["interactions"].push({interactionType: field.value});
                    this.cursors.doodadInteraction = length - 1;
                } else {
                    if (field.value == "") {
                        return;
                    }
                    puzzle.doodads[this.cursors.doodad]["interactions"][this.cursors.doodadInteraction][fieldName] = field.value;
                }
            } else {
                if (field.value == "") {
                    return;
                }
                fieldName = field.name.split("_")[1];
                puzzle.doodads[this.cursors.doodad][fieldName] = field.value;
            }
        }
    }
};

jQuery(function($) {
    GenesisForm.init();
});

const RoomForm = `
<fieldset class="sub-form js-id">
    <legend class="master"></legend>
    <div class="sub-form-bd">
        <div data-row-span="8">
            <div data-field-span="2">
                <label class="required">Room slug</label>
                <input type="text" name="room_slug" class="focus fieldset-master">
            </div>
            <div data-field-span="6">
                <label class="with-remove"><span class="required">Room Description</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form" tabindex="-1">Remove room</a></span></label>
                <textarea name="room_description" rows="4"></textarea>
            </div>
        </div>
        <fieldset class="room-doodad-list">
            <legend>Room Doodads <a href="#" class="btn btn_sm js-add-room-doodad">Add</a></legend>
        </fieldset>
        <fieldset class="room-exit-list">
            <legend>Room Exits <a href="#" class="btn btn_sm js-add-room-exit">Add</a></legend>
        </fieldset>
    </div>
</fieldset>
`;

const RoomDoodadForm = `
<div class="sub-form-item">
    <div data-row-span="12">
        <div data-field-span="2">
            <label class="required" title="Slug referring to a doodad to be placed in this room.">Doodad slug</label>
            <input type="text" name="room_doodad_doodadSlug" class="focus" data-related="doodad_slug">
            <div class="hint" style="display:none;">Slug doesn't exist. Create?</div>
        </div>
        <div data-field-span="1">
            <label class="required" title="Whether it is possible for an adventurer to take this doodad and place in their inventory.">Is gettable</label>
            <select name="room_doodad_isGettable">
                <option value="true">True</option>
                <option value="false">False</option>
            </select>
        </div>
        <div data-field-span="9">
            <label title="Message that is displayed to the adventurer if they inspect this doodad (while not carrying it)." class="with-remove"><span class="required">Look message</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form-item" tabindex="-1">X</a></span></label>
            <textarea name="room_doodad_lookMessage"></textarea>
        </div>
    </div>
</div>
`;

const RoomExitForm = `
<div class="sub-form-item">
    <div data-row-span="12">
        <div data-field-span="1">
            <label title="">Direction</label>
            <select name="room_exit_direction" class="focus">
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="north">North</option>
                <option value="east">East</option>
                <option value="south">South</option>
                <option value="west">West</option>
            </select>
        </div>
        <div data-field-span="2">
            <label class="required" title="Slug of the room to which this exit goes to">Exit room slug</label>
            <input type="text" name="room_exit_exitRoomSlug" data-related="room_slug">
            <div class="hint" style="display:none;">Slug doesn't exist. Create?</div>
        </div>
        <div data-field-span="9">
            <label title="Message that is displayed to the adventurer if they look in this direction" class="with-remove"><span class="required">Look message</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form-item" tabindex="-1">X</a></span></label>
            <textarea name="room_exit_lookMessage"></textarea>
        </div>
    </div>
    <div data-row-span="8">
        <div data-field-span="3">
            <label title="">Visibility doodad slug</label>
            <div class="hint hint_up" style="display:none;">Slug doesn't exist. Create?</div>
            <input type="text" name="room_exit_visibilityDoodadSlug" data-related="doodad_slug">
        </div>
        <div data-field-span="3">
            <label title="">Required doodad slug</label>
            <div class="hint hint_up" style="display:none;">Slug doesn't exist. Create?</div>
            <input type="text" name="room_exit_requiredDoodadSlug" data-related="doodad_slug">
        </div>
        <div data-field-span="2">
            <label title="">Move fail kills</label>
            <select name="room_exit_moveFailKills">
                <option value="false">False</option>
                <option value="true">True</option>
            </select>
        </div>
    </div>
    <div data-row-span="8">
        <div data-field-span="4">
            <label title="">Fail message</label>
            <textarea name="room_exit_failMessage" rows="3"></textarea>
        </div>
        <div data-field-span="4">
            <label title="">Public fail message</label>
            <textarea name="room_exit_publicFailMessage" rows="3"></textarea>
        </div>
    </div>
</div>
`;

const DoodadForm = `
<fieldset class="sub-form">
    <legend class="master"></legend>
    <div class="sub-form-bd sub-form-bd_alt">
        <div data-row-span="8">
            <div data-field-span="2">
                <label class="required">Doodad slug</label>
                <input type="text" name="doodad_slug" class="focus fieldset-master">
            </div>
            <div data-field-span="6">
                <label class="with-remove"><span class="required">Inventory message</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form" tabindex="-1">Remove doodad</a></span></label>
                <textarea name="doodad_inventoryMessage" rows="3"></textarea>
            </div>
        </div>
        <div data-row-span="1">
            <div data-field-span="1">
                <label>Inspect description</label>
                <textarea name="doodad_inspectDescription" rows="4"></textarea>
            </div>
        </div>
        <fieldset class="doodad-interactions-list">
            <legend>Interactions <a href="#" class="btn btn_sm js-add-doodad-interaction">Add</a></legend>
        </fieldset>
    </div>
</fieldset>
`;

const DoodadInteractionForm = `
<div class="sub-form-item">
    <div data-row-span="12">
        <div data-field-span="2">
            <label class="required" title="">Interaction type</label>
            <select name="doodad_interaction_interactionType" class="focus">
                <option value="get">Get</option>
                <option value="use">Use</option>
            </select>
        </div>
        <div data-field-span="10">
            <label title="" class="with-remove"><span>Success message</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form-item" tabindex="-1">X</a></span></label>
            <textarea name="doodad_interaction_successMessage"></textarea>
        </div>
    </div>
    <div data-row-span="12">
        <div data-field-span="6">
            <label>Fail message</label>
            <textarea name="doodad_interaction_failMessage" rows="4"></textarea>
        </div>
        <div data-field-span="6">
            <label>Public fail message</label>
            <textarea name="doodad_interaction_publicFailMessage" rows="4"></textarea>
        </div>
    </div>
    <div data-row-span="8">
        <div data-field-span="2">
            <label>Required doodad slug</label>
            <input type="text" name="doodad_interaction_requiredDoodadSlug" data-related="doodad_slug">
            <div class="hint hint_up" style="display:none;">Slug doesn't exist. Create?</div>
        </div>
        <div data-field-span="2">
            <label title="Whether the required doodad must be already used to be successful">Required doodad already used</label>
            <select name="doodad_interaction_requiredDoodadAlreadyUsed">
                <option value="false">False</option>
                <option value="true">True</option>
            </select>
        </div>
        <div data-field-span="2">
            <label>Success spawn doodad slug</label>
            <input type="text" name="doodad_interaction_successSpawnDoodadSlug" data-related="doodad_slug">
            <div class="hint hint_up" style="display:none;">Slug doesn't exist. Create?</div>
        </div>
        <div data-field-span="2">
            <label>Success teleport room slug</label>
            <input type="text" name="doodad_interaction_successTeleportRoomSlug" data-related="room_slug">
            <div class="hint hint_up" style="display:none;">Slug doesn't exist. Create?</div>
        </div>
    </div>
</div>
`;
