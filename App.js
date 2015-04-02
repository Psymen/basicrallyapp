Ext.define('DataObject', {
    extend: 'Ext.data.Model',
    fields: ['name', 'column1', 'column2']
});

Ext.define('CustomApp', {
	extend: 'Rally.app.App',
	componentCls: 'app',
	allStores: [],
	requires: [
		'Ext.grid.*',
	    'Ext.data.*',
	    'Ext.dd.*'
		],
	launch: function (){
		console.log("Loading...");
		this._loadHLSData();
	},

	// Get data from Rally
	_loadHLSData: function() {
		console.log(" .... HLS");
		this.hlsStore = Ext.create('Rally.data.wsapi.Store', {
			model: 'PortfolioItem/Initiative',
			fetch: ['FormattedID', 'Name'],
			autoLoad: true,
			listeners: {
				scope: this,
				load: function(userStore, myData, success) {
		            //process data
		            console.log('HLS',myData);
		            this.allStores.push(userStore);
		            this._loadEpicData();
		        }
		    }
		});
	},

	_loadEpicData: function() {
		console.log(" .... Epic");
		this.epicStore = Ext.create('Rally.data.wsapi.Store', {
			model: 'PortfolioItem/Feature',
			fetch: ['FormattedID', 'Name'],
			autoLoad: true,
			listeners: {
				scope: this,
				load: function(userStore, myData, success) {
		            //process data
		            console.log('Epic',myData);
		            this.allStores.push(userStore);
		            this._loadUserStoryData();
		        }
		    }
		});
	},

	_loadUserStoryData: function() {
		console.log(" .... US");
		this.userStore = Ext.create('Rally.data.wsapi.Store', {
			model: 'User Story',
			autoLoad: true,
			listeners: {
				scope: this,
				load: function(userStore, myData, success) {
		            //process data
		            console.log('User Story',myData);
		            this.allStores.push(userStore);
		            console.log('all data',this.allStores);
		            this._renderBoard()
		        }
		    },
		    fetch: ['FormattedID', 'Name']
		});
	},

	_renderBoard : function(hlsStore, epicStore, userStore) {
		var myData = [
	        { name : "Rec 0", column1 : "0", column2 : "0" },
	        { name : "Rec 1", column1 : "1", column2 : "1" },
	        { name : "Rec 2", column1 : "2", column2 : "2" },
	        { name : "Rec 3", column1 : "3", column2 : "3" },
	        { name : "Rec 4", column1 : "4", column2 : "4" },
	        { name : "Rec 5", column1 : "5", column2 : "5" },
	        { name : "Rec 6", column1 : "6", column2 : "6" },
	        { name : "Rec 7", column1 : "7", column2 : "7" },
	        { name : "Rec 8", column1 : "8", column2 : "8" },
	        { name : "Rec 9", column1 : "9", column2 : "9" }
    	];

		var firstGridStore = Ext.create('Ext.data.Store', {
			model: 'DataObject',
			data: myData
		});

	    var secondGridStore = Ext.create('Ext.data.Store', {
	        model: 'DataObject'
	    });

		var columns = [
	        {text: "Record Name", flex: 1, sortable: true, dataIndex: 'name'},
	        {text: "column1", width: 70, sortable: true, dataIndex: 'column1'},
	        {text: "column2", width: 70, sortable: true, dataIndex: 'column2'}
		];

		var firstGrid = Ext.create('Ext.grid.Panel', {
        	viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'firstGridDDGroup',
	                dropGroup: 'secondGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    console.log("Drag from right to left", 'Dropped ' + data.records[0].get('name') + dropOn);
	                }
	            }
        	},
	        store            : firstGridStore,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'High Level Scope',
	        margins          : '0 2 0 0'
    	});

	    var secondGrid = Ext.create('Ext.grid.Panel', {
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'secondGridDDGroup',
	                dropGroup: 'firstGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    console.log("Drag from left to right", 'Dropped ' + data.records[0].get('name') + dropOn);
	                }
	            }
	        },
	        store            : secondGridStore,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'Epics',
	        margins          : '0 0 0 3'
	    });

	    var thirdGrid = Ext.create('Ext.grid.Panel', {
	        viewConfig: {
	            plugins: {
	                ptype: 'gridviewdragdrop',
	                dragGroup: 'thirdGridDDGroup',
	                dropGroup: 'secondGridDDGroup'
	            },
	            listeners: {
	                drop: function(node, data, dropRec, dropPosition) {
	                    var dropOn = dropRec ? ' ' + dropPosition + ' ' + dropRec.get('name') : ' on empty view';
	                    console.log("Drag from left to right", 'Dropped ' + data.records[0].get('name') + dropOn);
	                }
	            }
	        },
	        store            : secondGridStore,
	        columns          : columns,
	        stripeRows       : true,
	        title            : 'User Stories',
	        margins          : '0 0 0 3'
	    });

	    var displayPanel = Ext.create('Ext.Panel', {
	        width        : 1000,
	        height       : 300,
	        layout       : {
	            type: 'hbox',
	            align: 'stretch',
	            padding: 5
	        },
	        // renderTo     : 'panel',
	        defaults     : { flex : 1 }, //auto stretch
	        items        : [
	            firstGrid,
	            secondGrid,
	            thirdGrid
	        ],
	        dockedItems: {
	            xtype: 'toolbar',
	            dock: 'bottom',
	            items: ['->', // Fill
	            {
	                text: 'Reset both grids',
	                handler: function(){
	                    //refresh source grid
	                    firstGridStore.loadData(myData);

	                    //purge destination grid
	                    secondGridStore.removeAll();

	                    thirdGridStore.removeAll();
	                }
	            }]
	        }
	    });
    	this.add(displayPanel);
	}
});


