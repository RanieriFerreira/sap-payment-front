sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/library",
    "sap/m/Link",
    "sap/m/MessageToast",
    "sap/m/MessageStrip",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    ],
    function (Controller, coreLibrary, Link, MessageStrip, MessageToast, Filter, FilterOperator) {
        "use strict";
        
        // shortcut for sap.ui.core.MessageType
	    var MessageType = coreLibrary.MessageType;

        var prefixId;
		var oScanResultText;
    
        return Controller.extend("sap.btp.sapui5.controller.List", {

            onListItemPress: function (oEvent) {
                MessageToast.show("Item Pressed: " + oEvent.getSource().getTitle());
            },
    
            onItemClose: function (oEvent) {
                var oItem = oEvent.getSource(),
                    oList = oItem.getParent();
    
                oList.removeItem(oItem);
                MessageToast.show("Item Closed: " + oItem.getTitle());
            },
    
            onRejectPress: function () {
                MessageToast.show("Reject Button Pressed");
            },
    
            onAcceptPress: function () {
                MessageToast.show("Accept Button Pressed");
            },
    
            onAcceptErrors: function (oEvent) {
                var oMessageStrip = new MessageStrip({
                    type: MessageType.Error,
                    showIcon: true,
                    showCloseButton: true,
                    text: "Error: Something went wrong.",
                    link: new Link({
                        text: "SAP CE",
                        href: "http://www.sap.com/",
                        target: "_blank"
                    })
                });
    
                var oNotificationListGroup = oEvent.getSource().getParent().getParent();
                var aNotifications = oNotificationListGroup.getItems();
    
                aNotifications.forEach(function (oNotification) {
                    oNotification.removeAllAggregation("processingMessage");
                });
    
                var iErrorIndex = Math.floor(Math.random() * 3);
                aNotifications[iErrorIndex].setProcessingMessage(oMessageStrip);
            },

            onInit: function () {
				prefixId = this.createId();
				if (prefixId){
					prefixId = prefixId.split("--")[0] + "--";
				} else {
					prefixId = "";
				}
				oScanResultText = sap.ui.getCore().byId(prefixId + 'sampleBarcodeScannerResult');
			},

			onScanSuccess: function(oEvent) {
				if (oEvent.getParameter("cancelled")) {
					MessageToast.show("Scan cancelled", { duration:1000 });
				} else {
					if (oEvent.getParameter("text")) {
						oScanResultText.setText(oEvent.getParameter("text"));
					} else {
						oScanResultText.setText('');
					}
				}
			},

			onScanError: function(oEvent) {
				MessageToast.show("Scan failed: " + oEvent, { duration:1000 });
			},

			onScanLiveupdate: function(oEvent) {
				// User can implement the validation about inputting value
			},

			onAfterRendering: function() {
				// Reset the scan result
				var oScanButton = sap.ui.getCore().byId(prefixId + 'sampleBarcodeScannerButton');
				if (oScanButton) {
					$(oScanButton.getDomRef()).on("click", function(){
						oScanResultText.setText('');
					});
				}
			},              
            
            handleSearch: function (evt) {
                // create model filter
                var filters = [];
                var query = evt.getParameter("query");
                if (query && query.length > 0) {
                    filters.push(new Filter({
                        path: "ProductName",
                        operator: FilterOperator.Contains,
                        value1: query
                    }));
                }
    
                // update list binding
                var list = this.getView().byId("list");
                var binding = list.getBinding("items");
                binding.filter(filters);
            },
    
            handleListItemPress: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var selectedProductId = oEvent.getSource().getBindingContext().getProperty("ProductID");
                oRouter.navTo("detail", {
                    productId: selectedProductId
                });
            }
        });
    });
    