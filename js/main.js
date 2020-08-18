const GenesisForm = {
    init: function() {
        this.bind();
    },
    bind: function() {
        const self = this;
        $('.js-add-room').on('click', function(e) {
            e.preventDefault();
            self.addRoom();
        });
        $('.js-add-doodad').on('click', function(e) {
            e.preventDefault();
            self.addDoodad();
        });
        $(document).on('click', '.js-add-room-doodad', function(e) {
            e.preventDefault();
            self.addRoomDoodad(this);
        });
        $(document).on('click', '.js-add-room-exit', function(e) {
            e.preventDefault();
            self.addRoomExit(this);
        });
        $(document).on('click', '.js-add-doodad-interaction', function(e) {
            e.preventDefault();
            self.addDoodadInteraction(this);
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
            if($(this).attr('disabled')) {
                return false;
            }
            e.preventDefault();
            self.loadJson($('#json_input').val());
        });
    },
    addRoom: function() {
        var newRoom = $(RoomForm).appendTo('#rooms_container');
        GridForms.init();
        return newRoom;
    },
    addRoomDoodad: function(el) {
        var newRoomDoodad = $(RoomDoodadForm).appendTo($(el).parents('.room-doodad-list'));
        GridForms.init();
        return newRoomDoodad;
    },
    addRoomExit: function(el) {
        var newRoomExit = $(RoomExitForm).appendTo($(el).parents('.room-exit-list'));
        GridForms.init();
        return newRoomExit
    },
    addDoodad: function() {
        var newDoodad = $(DoodadForm).appendTo('#doodads_container');
        GridForms.init();
        return newDoodad;
    },
    addDoodadInteraction: function(el) {
        var newDoodadInteraction = $(DoodadInteractionForm).appendTo($(el).parents('.doodad-interactions-list'));
        //$(el).parents('.doodad-interactions-list').append(DoodadInteractionForm);
        GridForms.init();
        return newDoodadInteraction;
    },
    removeSubform: function(el) {
        $(el).parents('.sub-form').eq(0).slideUp(400, function(){$(this).remove()});
    },
    removeSubformItem: function(el) {
        $(el).parents('.sub-form-item').eq(0).slideUp(400, function(){$(this).remove()});
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
                ef = this.addRoomExit(rf.find('.js-add-room-exit'));
                this.setIn(ef, 'room_exit_direction', exit.direction);
                this.setIn(ef, 'room_exit_exitRoomSlug', exit.exitRoomSlug);
                this.setIn(ef, 'room_exit_lookMessage', exit.lookMessage);
                this.setIn(ef, 'room_exit_visibilityDoodadSlug', exit.visibilityDoodadSlug);
                this.setIn(ef, 'room_exit_requiredDoodadSlug', exit.requiredDoodadSlug);
                this.setIn(ef, 'room_exit_moveFailKills', exit.moveFailKills);
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
    }
};

jQuery(function($) {
    GenesisForm.init();
});

const RoomForm = `
<fieldset class="sub-form">
    <legend></legend>
    <div class="sub-form-bd">
        <div data-row-span="8">
            <div data-field-span="2">
                <label>Room slug</label>
                <input type="text" name="room_slug">
            </div>
            <div data-field-span="6">
                <label class="with-remove"><span>Room Description</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form">Remove room</a></span></label>
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
            <label title="Slug referring to a doodad to be placed in this room.">Doodad slug</label>
            <input type="text" name="room_doodad_doodadSlug">
        </div>
        <div data-field-span="1">
            <label title="Whether it is possible for an adventurer to take this doodad and place in their inventory.">Is gettable</label>
            <select name="room_doodad_isGettable">
                <option value="true">True</option>
                <option value="false">False</option>
            </select>
        </div>
        <div data-field-span="9">
            <label title="Message that is displayed to the adventurer if they inspect this doodad (while not carrying it)." class="with-remove"><span>Look message</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form-item">X</a></span></label>
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
            <select name="room_exit_direction">
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="north">North</option>
                <option value="east">East</option>
                <option value="south">South</option>
                <option value="west">West</option>
            </select>
        </div>
        <div data-field-span="2">
            <label title="">Exit room slug</label>
            <input type="text" name="room_exit_exitRoomSlug">
        </div>
        <div data-field-span="9">
            <label title="" class="with-remove"><span>Look message</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form-item">X</a></span></label>
            <textarea name="room_exit_lookMessage"></textarea>
        </div>
    </div>
    <div data-row-span="8">
        <div data-field-span="3">
            <label title="">Visibility doodad slug</label>
            <input type="text" name="room_exit_visibilityDoodadSlug">
        </div>
        <div data-field-span="3">
            <label title="">Required doodad slug</label>
            <input type="text" name="room_exit_requiredDoodadSlug">
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
    <legend></legend>
    <div class="sub-form-bd sub-form-bd_alt">
        <div data-row-span="8">
            <div data-field-span="2">
                <label>Doodad slug</label>
                <input type="text" name="doodad_slug">
            </div>
            <div data-field-span="6">
                <label class="with-remove"><span>Inventory message</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form">Remove doodad</a></span></label>
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
            <label title="">Interaction type</label>
            <select name="doodad_interaction_interactionType">
                <option value="get">Get</option>
                <option value="use">Use</option>
            </select>
        </div>
        <div data-field-span="10">
            <label title="" class="with-remove"><span>Success message</span><span><a href="#" class="btn btn_sm btn_danger js-remove-sub-form-item">X</a></span></label>
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
            <input type="text" name="doodad_interaction_requiredDoodadSlug">
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
            <input type="text" name="doodad_interaction_successSpawnDoodadSlug">
        </div>
        <div data-field-span="2">
            <label>Success teleport room slug</label>
            <input type="text" name="doodad_interaction_successTeleportRoomSlug">
        </div>
    </div>
</div>
`;
