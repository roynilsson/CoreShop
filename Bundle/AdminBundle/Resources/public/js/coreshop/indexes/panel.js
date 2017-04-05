/**
 * CoreShop
 *
 * LICENSE
 *
 * This source file is subject to the GNU General Public License version 3 (GPLv3)
 * For the full copyright and license information, please view the LICENSE.md and gpl-3.0.txt
 * files that are distributed with this source code.
 *
 * @copyright  Copyright (c) 2015-2017 Dominik Pfaffenbauer (https://www.pfaffenbauer.at)
 * @license    https://www.coreshop.org/license     GNU General Public License version 3 (GPLv3)
 */

pimcore.registerNS('pimcore.plugin.coreshop.indexes.panel');

pimcore.plugin.coreshop.indexes.panel = Class.create(pimcore.plugin.coreshop.abstract.panel, {

    layoutId: 'coreshop_indexes_panel',
    storeId : 'coreshop_indexes',
    iconCls : 'coreshop_icon_indexes',
    type : 'indexes',

    url : {
        add : '/admin/CoreShop/indices/add',
        delete : '/admin/CoreShop/indices/delete',
        get : '/admin/CoreShop/indices/get',
        list : '/admin/CoreShop/indices/list',
        config: '/admin/CoreShop/indices/get-config',
        types : '/admin/CoreShop/indices/get-types'
    },

    typesStore : null,

    /**
     * constructor
     */
    initialize: function () {
        var proxy = new Ext.data.HttpProxy({
            url : this.url.types
        });

        var reader = new Ext.data.JsonReader({}, [
            { name:'name' }
        ]);

        this.typesStore = new Ext.data.Store({
            restful:    false,
            proxy:      proxy,
            reader:     reader,
            autoload:   true
        });
        this.typesStore.load();

        this.getConfig();

        this.panels = [];
    },

    getConfig : function() {
        this.getterStore = new Ext.data.JsonStore({
            data : []
        });

        this.interpreterStore = new Ext.data.JsonStore({
            data : []
        });

        this.fieldTypeStore = new Ext.data.JsonStore({
            data : []
        });

        pimcore.globalmanager.add('coreshop_index_getters', this.getterStore);
        pimcore.globalmanager.add('coreshop_index_interpreters', this.interpreterStore);
        pimcore.globalmanager.add('coreshop_index_fieldTypes', this.fieldTypeStore);

        Ext.Ajax.request({
            url: this.url.config,
            method: 'get',
            success: function (response) {
                try {
                    var res = Ext.decode(response.responseText);

                    this.getterStore.loadData(res.getters);
                    this.interpreterStore.loadData(res.interpreters);
                    this.fieldTypeStore.loadData(res.fieldTypes);
                    this.classId = res.classId;

                    // create layout
                    this.getLayout();
                } catch (e) {
                    //pimcore.helpers.showNotification(t('error'), t('coreshop_save_error'), 'error');
                }
            }.bind(this)
        });
    }
});
