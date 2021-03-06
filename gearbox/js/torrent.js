/**
 * Gearbox: a Web GUI for Transmission
 * 
 * Copyright (c) Mnemosyne LLC
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */


Ext.namespace( 'Torrent' );

Torrent.INFO = 1;
Torrent.STAT = 2;
Torrent.STAT_EXTRA = 3;
Torrent.DERIVED = 4;
Torrent.fields = [
        { name: 'id',                       type: 'int',      group: Torrent.INFO },
        { name: 'files',                    type: 'auto',     group: Torrent.INFO },
        { name: 'fileStats',                type: 'auto',     group: Torrent.STAT_EXTRA },
        { name: 'rateUpload',               type: 'float',    group: Torrent.STAT },    /* Bps */
        { name: 'rateDownload',             type: 'float',    group: Torrent.STAT },    /* Bps */
        { name: 'rateXfer',                 type: 'float',    group: Torrent.DERIVED }, /* Bps */
        { name: 'downloadDir',              type: 'string',   group: Torrent.STAT },
        { name: 'status',                   type: 'int',      group: Torrent.STAT },
        { name: 'state',                    type: 'int',      group: Torrent.DERIVED },
        { name: 'name',                     type: 'string',   group: Torrent.INFO },
        { name: 'collatedName',             type: 'string',   group: Torrent.DERIVED },
        { name: 'error',                    type: 'int',      group: Torrent.STAT },
        { name: 'errorString',              type: 'string',   group: Torrent.STAT },
        { name: 'sizeWhenDone',             type: 'int',      group: Torrent.STAT },
        { name: 'leftUntilDone',            type: 'int',      group: Torrent.STAT },
        { name: 'haveUnchecked',            type: 'int',      group: Torrent.STAT },
        { name: 'haveValid',                type: 'int',      group: Torrent.STAT },
        { name: 'desiredAvailable',         type: 'int',      group: Torrent.STAT },
        { name: 'totalSize',                type: 'int',      group: Torrent.INFO },
        { name: 'pieceSize',                type: 'int',      group: Torrent.INFO },
        { name: 'pieceCount',               type: 'int',      group: Torrent.INFO },
        { name: 'peersGettingFromUs',       type: 'int',      group: Torrent.STAT },
        { name: 'peersSendingToUs',         type: 'int',      group: Torrent.STAT },
        { name: 'webseedsSendingToUs',      type: 'int',      group: Torrent.STAT_EXTRA },
        { name: 'percentDone',              type: 'float',    group: Torrent.STAT },
        { name: 'metadataPercentComplete',  type: 'float',    group: Torrent.STAT },
        { name: 'recheckProgress',          type: 'float',    group: Torrent.STAT },
        { name: 'activityDate',             type: 'int',      group: Torrent.STAT_EXTRA },
        { name: 'addedDate',                type: 'int',      group: Torrent.INFO },
        { name: 'startDate',                type: 'int',      group: Torrent.STAT_EXTRA },
        { name: 'dateCreated',              type: 'int',      group: Torrent.INFO },
        { name: 'peersConnected',           type: 'int',      group: Torrent.STAT },
        { name: 'eta',                      type: 'int',      group: Torrent.STAT },
        { name: 'uploadRatio',              type: 'float',    group: Torrent.STAT },
        { name: 'downloadedEver',           type: 'int',      group: Torrent.STAT },
        { name: 'uploadedEver',             type: 'int',      group: Torrent.STAT },
        { name: 'corruptEver',              type: 'int',      group: Torrent.STAT_EXTRA },
        { name: 'trackers',                 type: 'auto',     group: Torrent.STAT }, // array of trackers
        { name: 'trackerStats',             type: 'auto',     group: Torrent.STAT_EXTRA }, // array of trackerStats
        { name: 'seedRatioLimit',           type: 'float',    group: Torrent.STAT },
        { name: 'seedRatioMode',            type: 'int',      group: Torrent.STAT },
        { name: 'seedIdleLimit',            type: 'int',      group: Torrent.STAT_EXTRA },
        { name: 'seedIdleMode',             type: 'int',      group: Torrent.STAT_EXTRA },
        { name: 'downloadLimit',            type: 'int',      group: Torrent.STAT_EXTRA }, /* KB/s */
        { name: 'downloadLimited',          type: 'boolean',  group: Torrent.STAT_EXTRA },
        { name: 'uploadLimit',              type: 'int',      group: Torrent.STAT_EXTRA }, /* KB/s */
        { name: 'uploadLimited',            type: 'boolean',  group: Torrent.STAT_EXTRA },
        { name: 'honorsSessionLimits',      type: 'boolean',  group: Torrent.STAT_EXTRA },
        { name: 'peer-limit',               type: 'int',      group: Torrent.STAT_EXTRA },
        { name: 'hashString',               type: 'string',   group: Torrent.INFO },
        { name: 'isFinished',               type: 'boolean',  group: Torrent.STAT },
        { name: 'isPrivate',                type: 'boolean',  group: Torrent.INFO },
        { name: 'comment',                  type: 'string',   group: Torrent.INFO },
        { name: 'creator',                  type: 'string',   group: Torrent.INFO },
        { name: 'manualAnnounceTime',       type: 'int',      group: Torrent.STAT_EXTRA },
        { name: 'peers',                    type: 'auto',     group: Torrent.STAT_EXTRA }, // array of peer objects
        { name: 'torrentFile',              type: 'string',   group: Torrent.STAT_EXTRA },
        { name: 'bandwidthPriority',        type: 'int',      group: Torrent.STAT_EXTRA } ];


Torrent.Record = Ext.data.Record.create( Torrent.fields );

// create the derived fields when necessary
Torrent.Record.prototype.set = function(key,val){
    this.superclass().set.call(this, key, val);
    if(this.isModified(key)){
        switch(key){
            case 'name':
                this.set('collatedName', Ext.util.Format.lowercase(val.trim()));
                break;
            case 'rateDownload':
            case 'rateUpload':
                this.set('rateXfer', this.data.rateUpload + this.data.rateDownload);
                break;
            case 'trackers': {
                var t,
                    trackers = this.data.trackers,
                    i = trackers.length;
                while( i-- ) {
                    t = trackers[i];
                    t.uri = parseUri(t.announce);
                    t.host = getHost(t.uri);
                    t.readableHost = getNameFromHost(t.host);
                }
                break;
            }
            case 'error':
            case 'status':
                this.set('state', this.data.error ? -1 : this.data.status );
                break;
            default:
                break;
        }
    }
};

Torrent.reader = new Ext.data.JsonReader({
    fields: Torrent.Record,
    idProperty: 'id',
    root: 'torrents'
}, Torrent.Record);

Torrent.store = new Ext.data.Store({ reader: Torrent.reader });

Torrent.store.getUnfilteredCount = function(){
    return (this.snapshot || this).getCount();
}

/** Returns an object mapping end-user readable keys to full hostname values */
Torrent.store.getAllTrackers = function(){
    var i,
        j,
        t,
        trackers,
        hash = { },
        allrecs = this.snapshot || this.data;

    for( i=allrecs.length; i--; ) {
        trackers = allrecs.itemAt(i).data.trackers;
        for( j=trackers.length; j--; ) {
            t = trackers[j];
            hash[t.readableHost] = t.host;
        }
    }

    return hash;
}

// create the derived fields when necessary
Torrent.store.addListener( 'add', function( store, records, index ) {
    for(var i=records.length; i--; ) {
        var d = records[i].data,
            trackers = d.trackers,
            j = trackers.length,
            t;
        d.collatedName = Ext.util.Format.lowercase(d.name.trim());
        d.rateXfer = (d.rateUpload||0) + (d.rateDownload||0);
        d.state = d.error ? -1 : d.status;
        while( j-- ) {
            t = trackers[j];
            t.uri = parseUri(t.announce);
            t.host = getHost(t.uri);
            t.readableHost = getNameFromHost(t.host);
        }
}
});

Torrent.buildKeyArray = function( mode )
{
    var f,
        keys = [ ],
        fields = Torrent.fields,
        i = fields.length;

    while(i--) {
        f = fields[i];
        if(( f.group==mode ) || (f.name=='id'))
            keys.push(f.name);
    }

    return keys;
};

Torrent.keys = [ ];
Torrent.keys[Torrent.INFO] = Torrent.buildKeyArray(Torrent.INFO);
Torrent.keys[Torrent.STAT] = Torrent.buildKeyArray(Torrent.STAT);
Torrent.keys[Torrent.STAT_EXTRA] = Torrent.buildKeyArray(Torrent.STAT_EXTRA);

Torrent.getStatKeys = function( ) { return this.keys[ this.STAT ]; };
Torrent.getInfoKeys = function( ) { return this.keys[ this.INFO ]; };
Torrent.getExtraStatKeys = function( ) { return this.keys[ this.STAT_EXTRA ]; };

Torrent.STATUS_CHECK_WAIT   = ( 1 << 0 ); /* Waiting in queue to check files */
Torrent.STATUS_CHECK        = ( 1 << 1 ); /* Checking files */
Torrent.STATUS_DOWNLOAD     = ( 1 << 2 ); /* Downloading */
Torrent.STATUS_SEED         = ( 1 << 3 ); /* Seeding */
Torrent.STATUS_STOPPED      = ( 1 << 4 ); /* Torrent is stopped */

Torrent.STAT_OK               = 0; // everything's fine
Torrent.STAT_TRACKER_WARNING  = 1; // when we anounced to the tracker, we got a warning in the response
Torrent.STAT_TRACKER_ERROR    = 2; // when we anounced to the tracker, we got an error in the response
Torrent.STAT_LOCAL_ERROR      = 3; // local trouble, such as disk full or permissions error

Torrent.PRIORITY_LOW     = -1;
Torrent.PRIORITY_NORMAL  = 0;
Torrent.PRIORITY_HIGH    = 1;

Torrent.TR_RATIOLIMIT_GLOBAL    = 0;
Torrent.TR_RATIOLIMIT_SINGLE    = 1;
Torrent.TR_RATIOLIMIT_UNLIMITED = 2;

Ext.apply( Torrent.Record.prototype, {

    getTrackers: function( ) { return this.data.trackers; },
    getTrackerStats: function( ) { return this.data.trackerStats; },
    getFiles: function( ) { return this.data.files; },
    getFileStats: function( ) { return this.data.fileStats; },
    isMagnet: function( ) { return this.data.metadataPercentComplete < 1; },
    activity: function( ) { return this.data.status; },
    isFinished: function( ) { return this.data.isFinished; },
    downloadedEver: function( ) { return this.data.downloadedEver },
    uploadedEver: function( ) { return this.data.uploadedEver },
    corruptEver: function( ) { return this.data.corruptEver },
    getETA: function( ) { return this.data.eta; },
    haveUnchecked: function( ) { return this.data.haveUnchecked; },
    haveValid: function( ) { return this.data.haveValid; },
    desiredAvailable: function( ) { return this.data.desiredAvailable; },
    sizeWhenDone: function( ) { return this.data.sizeWhenDone; },
    leftUntilDone: function( ) { return this.data.leftUntilDone; },
    totalSize: function( ) { return this.data.totalSize; },
    percentDone: function( ) { return this.data.percentDone; },
    uploadRatio: function( ) { return this.data.uploadRatio; },
    uploadedEver: function( ) { return this.data.uploadedEver; },
    getId: function( ) { return this.data.id; },
    getName: function( ) { return this.data.name; },
    hasError: function( ) { return this.data.error != 0; },
    peersConnected: function( ) { return this.data.peersConnected; },
    peersSendingToUs: function( ) { return this.data.peersSendingToUs; },
    peersGettingFromUs: function( ) { return this.data.peersGettingFromUs; },
    getPieceSize: function( ) { return this.data.pieceSize; },
    getPieceCount: function( ) { return this.data.pieceCount; },
    lastStartedAt: function( ) { return this.data.startDate; },
    runningTime: function( ) { return (new Date().getTime()/1000) - this.lastStartedAt(); },
    lastActivityAt: function( ) { return this.data.activityDate; },
    timeSinceLastActivity: function( ) { return (new Date().getTime()/1000) - this.lastActivityAt(); },

    isSeeding: function( ) { return this.activity() == Torrent.STATUS_SEED; },
    isPaused: function( ) { return this.activity() == Torrent.STATUS_STOPPED; },
    isVerifying: function( ) { return this.activity() == Torrent.STATUS_CHECK; },
    isWaitingToVerify: function( ) { return this.activity() == Torrent.STATUS_CHECK_WAIT; },
    isDownloading: function( ) { return this.activity() == Torrent.STATUS_DOWNLOAD; },
    isReadyToTransfer: function( ) { return this.isSeeding() || this.isDownloading(); },
    hasETA: function( ) { return this.getETA() >= 0; },
    isDone: function( ) { return this.haveValid() >= this.sizeWhenDone(); },
    isSeed: function( ) { return this.haveValid() >= this.totalSize(); },
    isActive: function( ) { return this.peersSendingToUs()>0 || this.peersGettingFromUs()>0 || this.isVerifying(); },
    haveTotal: function( ) { return this.haveUnchecked() + this.haveValid(); },
    percentComplete: function( ) { return this.haveTotal() * 100.0 / this.sizeWhenDone(); },

    getSeedRatio: function( ) {
        var ratio;
        switch( this.data.seedRatioMode ) {
            case Torrent.TR_RATIOLIMIT_GLOBAL:
                ratio = Transmission.prefs.getBool('seedRatioLimited')
                      ? Transmission.prefs.getNumber('seedRatioLimit')
                      : -1;
                break;
            case Torrent.TR_RATIOLIMIT_SINGLE:
                ratio = this.data.seedRatioLimit;
                break;
            default: /* Torrent.RATIOLIMIT_UNLIMITED */
                ratio = -1;
                break;
        }
        return ratio;
    },

    getError: function( ) {
        var s = this.data.errorString;
        switch( this.data.error ) {
            case Torrent.STAT_TRACKER_WARNING: s = String.format( 'Tracker gave a warning: {0}', s ); break;
            case Torrent.STAT_TRACKER_ERROR: s = String.format( 'Tracker gave an error: {0}', s ); break;
            case Torrent.STAT_LOCAL_ERROR: s = String.format( 'Error: {0}', s ); break;
            default: s = ''; break;
        }
        return s;
    },

    getActivityString: function( ) {
        switch( this.data.status ) {
            case Torrent.STATUS_CHECK_WAIT: return 'Waiting to verify local data'; break;
            case Torrent.STATUS_CHECK:      return 'Verifying local data'; break;
            case Torrent.STATUS_DOWNLOAD:   return 'Downloading'; break;
            case Torrent.STATUS_SEED:       return 'Seeding'; break;
            case Torrent.STATUS_STOPPED:    return this.isFinished() ? 'Finished' : 'Paused'; break;
        }
    }
});
