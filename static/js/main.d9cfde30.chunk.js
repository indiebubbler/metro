(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{102:function(e,t,n){},108:function(e,t,n){},176:function(e,t,n){"use strict";n.r(t);var a=n(1),r=n.n(a),s=n(12),i=n.n(s),o=(n(102),n(53)),l=n(29),c=n(13),u=n(16),p=n(14),m=n(8),h=n(15),d=(n(108),n(20)),f=n.n(d),v={ACCENT_1:0,ACCENT_2:1,ACCENT_3:2},b=[v.ACCENT_1,v.ACCENT_2,v.ACCENT_3],g=function(e){function t(e){var n;Object(c.a)(this,t),console.log("<SoundMachineInstrument>constructor",e.key);var a={C3:e.samples[0],"C#3":e.samples[1],D3:e.samples[2]};return(n=Object(p.a)(this,Object(m.a)(t).call(this,a,{baseUrl:e.baseUrl||"./audio/"+e.key+"/"}))).key=e.key,n.label=e.label,n}return Object(h.a)(t,e),t}(d.Sampler),y={TABLA:"tabla",ELECTRO_KIT:"electrokit"},E=function(e){function t(e){var n;Object(c.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this))).state={},n.lib={},n.currentInstrument=void 0;var a=new g({key:y.TABLA,label:"Tabla",samples:["dha-slide.wav","dhin-slide.wav","tin.wav"]}).toMaster();n.lib[a.key]=a;var r=new g({key:y.ELECTRO_KIT,label:"Electronic Kit",samples:["Kick.wav","HiHat.wav","Snare.wav"]}).toMaster();return n.lib[r.key]=r,n.setInstrument(e),console.log("<InstrumentLib>done constructor"),n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"setInstrument",value:function(e){if(void 0===this.lib[e])throw new Error("InstrumentLib has no such instrument with given key: "+e);this.currentInstrument=e}},{key:"getInstrument",value:function(){if(void 0===this.lib[this.currentInstrument])throw new Error("There is no such instrument in InstrumentLib: "+this.currentInstrument);return this.lib[this.currentInstrument]}}]),t}(a.Component),S=n(89),k=function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).accentNotes=["C3","C#3","D3"],n.instrumentLib=void 0,n.currentBeat=0,n.beatsPerStep=4,n.score=["C3","C#3","C#3","C#3"],n.state={isPlaying:!1},n.accents=[v.ACCENT_1],n.samples={},n.instruments={},n.part=null,n.repeat=function(e){var t=n.currentBeat++%n.beatsPerStep,a=n.score[t];n.instrumentLib.getInstrument().triggerAttackRelease(a,"4n",e);var r=n.updateVis;f.a.Draw.schedule(function(){return r(t)},e)},n.setBpm=function(e){if(isNaN(e)||e<=0||e>1e3)throw new Error("Invalid BPM value: "+e);f.a.Transport.bpm.value=e},n.setBeatsPerStep=function(e){for(n.beatsPerStep=e;n.score.length>e;)n.score.pop();for(;n.score.length<e;)n.score.push(v.ACCENT_1);f.a.Transport.timeSignature=[e,4],n.setLoopEnd(n.loopEndEvent.barsAmount),n.setState({beatsPerStep:e})},n.updateVis=function(e){n.props.onBeat(e)},n.playNote=function(e,t){n.instrumentLib.getInstrument().triggerAttackRelease(t,"4n",e)},n.handleStartStop=function(){!0===n.state.isPlaying?n.stop():n.start(),n.props.onToggle(n.state.isPlaying)},n.getBpm=function(){return f.a.Transport.bpm.value},n.instrumentLib=new E(n.props.instrument),n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"onBufferError",value:function(){throw new Error("Some buffers weren't found")}},{key:"componentDidMount",value:function(){var e=this;(new f.a.Synth).toMaster().triggerAttackRelease("A2"),f.a.Buffer.on("error",function(){return e.onBufferError()}),f.a.context.latencyHint="playback",f.a.Transport.scheduleRepeat(function(t){return e.repeat(t)},"4n",0),this.loopEndEvent=new f.a.Event(function(e,t){this.initialized&&t(),this.initialized=!0},this.props.onLoopEnd),this.loopEndEvent.loop=!0}},{key:"setInstrument",value:function(e){this.instrumentLib.setInstrument(e)}},{key:"getCurrentInstrumentLabel",value:function(){return this.instrumentLib.getInstrument().label}},{key:"setLoopEnd",value:function(e){this.loopEndEvent.cancel(),this.loopEndEvent.barsAmount=e,this.loopEndEvent.loopEnd=this.loopEndEvent.barsAmount+"m",this.loopEndEvent.loop=!0}},{key:"setAccents",value:function(e){this.accents=e;for(var t=0;t<this.score.length;t++){var n=this.accentNotes[v.ACCENT_2];void 0!==e[t]&&e[t]===v.ACCENT_1?n=this.accentNotes[v.ACCENT_1]:void 0!==e[t]&&e[t]===v.ACCENT_3&&(n=this.accentNotes[v.ACCENT_3]),this.score[t]=n}}},{key:"render",value:function(){var e=this;return r.a.createElement(S.a,{outline:!0,color:"light",onClick:function(){return e.handleStartStop()},block:!0,active:this.state.isPlaying},"Start / Stop")}},{key:"stop",value:function(){this.setState({isPlaying:!1}),this.currentBeat=0,f.a.Transport.stop(),this.loopEndEvent.stop()}},{key:"start",value:function(){this.setState({isPlaying:!0}),f.a.Transport.start("+0.1"),this.loopEndEvent.start("+0.1")}}]),t}(a.Component),B=k;k.defaultProps={beatsPerStep:4,onLoopEnd:null,onToggle:function(e){}};var C=n(178),P={BY_BAR:"by_bar",BY_TIME:"by_time",STABLE:"stable"},A=n(177),T=function(e){function t(){var e,n;Object(c.a)(this,t);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return(n=Object(p.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={},n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement(A.a,{className:"SimpleProgress"},r.a.createElement("div",{className:"bar",style:{width:this.props.value+"%",display:"block"}}))}}]),t}(a.Component),O={padTime:function(e){return e<10?"0"+e:e},formatTime:function(e){var t=new Date(0,0,0,0,0,0,0);t.setSeconds(e);var n="";return 0!==t.getMinutes()?(n+=t.getMinutes(),n+=":",n+=""+O.padTime(t.getSeconds())):n+=t.getSeconds(),n}},M=O,w=function(e){function t(){var e,n;Object(c.a)(this,t);for(var a=arguments.length,s=new Array(a),i=0;i<a;i++)s[i]=arguments[i];return(n=Object(p.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(s)))).state={bars:[],stepProgress:0,isPaused:!1},n.timer={ref:null,startTime:null},n.stepsCounter=0,n.stepProgressUpdateInterval=1e3/30,n.planChanged=function(){n.props.onChange&&n.props.onChange()},n.barRender=function(e){var t=n.state.currentStep===e.step?"current-step":"";return r.a.createElement("div",{onClick:function(){return n.onStepClick(e.step)},className:"step "+t,key:"key_"+e.bpm},void 0!==e.segmentDuration?M.formatTime(e.segmentDuration.toFixed(0))+" ":e.end+" bars ","at ",e.bpm.toFixed(0))},n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"makePlan",value:function(e){var t=[];if(e.playMode===P.BY_BAR)for(var n=e.bpmRange[0],a=e.bpmRange[1],r=n;r<=a;){var s={bpm:r,end:e.interval};t.push(s),r+=e.bpmStep}else if(e.playMode===P.BY_TIME)for(var i=e.bpmRange[0],o=e.bpmRange[1],l=i;l<=o;){var c={time:0*e.interval,start:0*e.interval,end:0*e.interval+e.interval,bpm:l};t.push(c),l+=e.bpmStep}else if(e.playMode===P.STABLE){var u={time:1/0,bpm:e.stableBpmSlider};t.push(u)}return t}},{key:"setPlan",value:function(e){var t=this,n=this.makePlan(e),a=[],r=0,s=e.playMode,i=0;switch(e.playMode){case P.BY_BAR:for(i=0;i<n.length;i++){var o={bpm:n[i].bpm,end:n[i].end,step:this.stepsCounter++};r+=60/n[i].bpm*e.beatsPerStep*n[i].end,a.push(o)}break;case P.BY_TIME:for(i=0;i<n.length;i++){var l={time:n[i].time,timeEnd:n[i].end,segmentDuration:n[i].end-n[i].time,startTimeFormatted:M.formatTime(n[i].start),endTimeFormatted:M.formatTime(n[i].end),bpm:n[i].bpm,step:this.stepsCounter++};r+=n[i].end,a.push(l)}break;case P.STABLE:r=1/0,a.push({bpm:n[0].bpm,time:1/0,step:0}),console.log("plan set to play at {0} bpm",n[0].bpm)}this.stepsCounter=0,this.setState(function(e){return{totalPlanTime:r,currentStep:0,bars:a,playMode:s}},function(){return t.planChanged()})}},{key:"stop",value:function(){this.pause(),this.resetStep()}},{key:"stepForward",value:function(){this.props.lockBpm||(this.state.currentStep+1>=this.state.bars.length?(this.timer&&(console.log("stepforward() timer clear"),clearInterval(this.timer.ref),this.timer=void 0),this.props.onAdvance(null)):(this.setState({currentStep:this.state.currentStep+1}),this.props.onAdvance(this.state.bars[this.state.currentStep])))}},{key:"stepBackward",value:function(){if(!this.props.lockBpm){if(this.state.currentStep-1<0)return this.timer&&(console.log("stepBackward timer clear"),clearInterval(this.timer.ref),this.time=void 0),void this.props.onAdvance(null);this.setState({currentStep:this.state.currentStep-1}),this.props.onAdvance(this.state.bars[this.state.currentStep])}}},{key:"onInterval",value:function(){this.stepForward(),this.timer&&(this.timer.startTime=new Date)}},{key:"start",value:function(){var e=this;if(console.log("<Planner>start()"),this.timer&&(console.log("<Planner>startTimer() old timer disposed"),clearInterval(this.timer.ref),this.timer.ref=void 0,this.timer.startTime=null,this.resetStep()),this.state.playMode===P.BY_TIME){var t=1e3*(this.state.bars[this.state.currentStep].timeEnd-this.state.bars[this.state.currentStep].time),n=this.onInterval.bind(this);this.timer={ref:setInterval(n,t),startTime:new Date,interval:t},console.log("timer defined, startTime",this.timer.startTime,this.timer.interval)}this.state.playMode!==P.STABLE?this.stepProgressUpdateTimer||(this.stepProgressUpdateTimer=setInterval(function(){return e.updateStepProgress()},this.stepProgressUpdateInterval)):(console.log("clear stepProgressUpdateTimer"),clearInterval(this.stepProgressUpdateTimer)),this.state.playMode===P.BY_BAR&&(this.event.initialized=!1,this.event.start())}},{key:"setProgressEvent",value:function(e){this.event=e}},{key:"updateStepProgress",value:function(){if(!this.props.lockBpm&&this.state.playMode!==P.STABLE){var e=this.getCurrentBar(),t=0;if(this.state.playMode===P.BY_BAR)t=this.event.progress;else if(this.state.playMode===P.BY_TIME){if(!this.timer)throw new Error("Timer doesn't exists");t=(Date.now()-this.timer.startTime.getTime())/e.segmentDuration/1e3}else t=0;t>1&&(t=1),this.setState({stepProgress:t})}}},{key:"clear",value:function(){this.stepsCounter=0,this.setState({bars:[],currentStep:0}),this.planChanged()}},{key:"resetStep",value:function(){this.setState({currentStep:0}),this.props.onAdvance(this.state.bars[0])}},{key:"getCurrentBar",value:function(){if(this.state.currentStep>=this.state.bars.length)throw new Error("Trying to get step that doesn't exists");return this.state.bars[this.state.currentStep]}},{key:"onStepClick",value:function(e){var t=this;this.setState({currentStep:e},function(){return t.props.onAdvance(t.state.bars[t.state.currentStep])})}},{key:"formatTime",value:function(e){return e.getMinutes()+":"+e.getSeconds()}},{key:"pause",value:function(){this.state.isPaused||(this.timer&&(console.log("stop() timer clear"),clearInterval(this.timer.ref),this.timer=void 0),this.stepProgressUpdateTimer&&(clearInterval(this.stepProgressUpdateTimer),this.stepProgressUpdateTimer=void 0),this.setState({isPaused:!0}))}},{key:"render",value:function(){var e=this;return 0===this.state.bars.length?r.a.createElement("div",null,"No plan"):this.state.bars[0].time===1/0?r.a.createElement("div",null,r.a.createElement("h2",null,r.a.createElement(C.a,{color:"dark"},"BPM: ",this.props.currentBpm))):r.a.createElement("div",{className:"Planner"},r.a.createElement("h2",null,r.a.createElement(C.a,{color:"dark"},"BPM: ",this.props.currentBpm)),r.a.createElement(T,{value:100*this.state.stepProgress}),r.a.createElement("div",{style:this.props.lockBpm?{opacity:.5}:{}},this.state.bars.map(function(t){return e.barRender(t)})),r.a.createElement("div",null,"Total time: ",M.formatTime(this.state.totalPlanTime)))}}]),t}(a.Component),j=w;w.defaultProps={playMode:P.BY_BAR,currentStep:0};n(112),n(114);var I=n(183),R=n(184),_=n(191),N=n(185),L=n(186),D=n(187),Y=n(54),F=n(39),x=function(e){function t(){return Object(c.a)(this,t),Object(p.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,r.a.createElement(C.a,{color:"light",className:"d-i"},this.state.value)),r.a.createElement("div",{style:{height:"30px"}},r.a.createElement("div",null,Object(Y.a)(Object(m.a)(t.prototype),"render",this).call(this))))}},{key:"onBadgeClick",value:function(){}}]),t}(F.b),V=n(96),U=function(e){function t(){var e,n;Object(c.a)(this,t);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return(n=Object(p.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={isCurrent:!1},n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"Accent "+(!0===this.state.isCurrent?"active":""),onClick:this.props.onClick},r.a.createElement("div",{className:"type"+this.props.type}))}},{key:"toggleCurrent",value:function(){this.setState({isCurrent:!this.state.isCurrent})}}]),t}(a.Component),z=function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).state={bars:[]},n.state.bars=e.defaultValue,n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"setAccents",value:function(e,t){this.setState({bars:e},this.props.onAfterChange)}},{key:"handleCellClick",value:function(e){var t=Object(V.a)(this.state.bars),n=t[e];t[e]=b[(n+1)%3],this.setState({bars:t},this.props.onAfterChange)}},{key:"getAccents",value:function(){return this.state.bars}},{key:"setActive",value:function(e){this.lastActiveAccent&&(this.lastActiveAccent.toggleCurrent(),this.lastActiveAccent=void 0);var t=this.refs["accent"+e];t&&(t.toggleCurrent(),this.lastActiveAccent=t)}},{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,this.state.bars.map(function(t,n){return r.a.createElement(U,{ref:"accent"+n,type:t,onClick:function(){return e.handleCellClick(n)}})}))}}]),t}(a.Component),K=n(45),J=n(190),H=n(179),X=n(180),G=n(181),W=n(182),q=function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).state={modal:!1,preset:null,showDelete:!1},n.state={modal:!1},n.toggle=n.toggle.bind(Object(K.a)(Object(K.a)(n))),n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"toggle",value:function(){this.setState(function(e){return{modal:!e.modal}})}},{key:"handleSave",value:function(){var e=this.state.preset,t=this.state.preset.title;t&&t.length>0&&(this.props.onSave(t,e),this.toggle())}},{key:"edit",value:function(e,t){this.setState({preset:e,showDelete:t},this.toggle)}},{key:"titleChanged",value:function(e){var t=e.target.value,n=Object(l.a)({},this.state.preset);n.title=t,this.setState({preset:n})}},{key:"onDeleteBtn",value:function(){this.props.onDeleteBtn(this.state.preset),this.toggle()}},{key:"renderDelete",value:function(){var e=this;if(!0===this.state.showDelete)return r.a.createElement(S.a,{color:"warning",onClick:function(){return e.onDeleteBtn()}},"Delete")}},{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement(S.a,{outline:!0,size:"sm",color:"light",onClick:this.props.onSaveBtn},"Save Preset"),r.a.createElement(J.a,{isOpen:this.state.modal,toggle:this.toggle,className:this.props.className},r.a.createElement(H.a,{toggle:this.toggle},"Save Preset"),r.a.createElement(X.a,null,r.a.createElement(G.a,{onChange:function(t){return e.titleChanged(t)},defaultValue:this.state.preset&&this.state.preset.title||""}),r.a.createElement("div",{className:"code"},JSON.stringify(this.state.preset))),r.a.createElement(W.a,null,r.a.createElement(S.a,{color:"primary",onClick:function(){return e.handleSave()}},"Save")," ",r.a.createElement(S.a,{color:"secondary",onClick:this.toggle},"Cancel"),this.renderDelete())))}}]),t}(a.Component),$=q;q.defaultProps={onDeleteBtn:function(e){},onSave:function(e,t){},onSaveBtn:function(e,t){}};var Q=function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).state={showDelete:[],showEdit:[]},n.userPresets=n.props.cookies.get("userPresets"),n.state.showDelete=n.userPresets?Array(n.userPresets.length).fill(!1):[],n.state.showEdit=n.userPresets?Array(n.userPresets.length).fill(!1):[],n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"onPresetClick",value:function(e){this.props.onSelect(e)}},{key:"onSavePreset",value:function(e,t){var n=Object(l.a)({title:e},t),a=this.props.cookies.get("userPresets");a||(a=[]);for(var r=-1,s=0;s<a.length;s++)a[s].title.toLowerCase()===e.toLowerCase()&&(r=s);r<0?a.push(n):a[r]=n,this.saveInCookie(a)}},{key:"saveInCookie",value:function(e){this.props.cookies.set("userPresets",JSON.stringify(e),{path:"/"}),this.userPresets=e}},{key:"showDeleteBtn",value:function(e,t){var n=Object(l.a)({},this.state);n[t]=!0,this.setState({showDelete:n})}},{key:"showEditBtn",value:function(e,t){var n=Object(l.a)({},this.state);n[t]=!0,this.setState({showEdit:n})}},{key:"hideEditBtn",value:function(e){this.setState({showEdit:!1})}},{key:"onPresetDelete",value:function(e){var t=this.userPresets.indexOf(e);if(t<0)throw new Error("Selected preset "+e.title+" has not been found in the store");this.userPresets.splice(t,1),this.saveInCookie(this.userPresets)}},{key:"onPresetEdit",value:function(e,t){console.log("preset EDIT",e,t),e.stopPropagation(),void 0!==t?this.refs.presetEditor.edit(this.userPresets[t],!0):this.refs.presetEditor.edit(this.props.preset)}},{key:"render",value:function(){var e=this,t=this.props.cookies.cookies.userPresets?JSON.parse(this.props.cookies.cookies.userPresets):[];return r.a.createElement(A.a,{className:"PresetsManager"},r.a.createElement(I.a,null,this.props.presets.map(function(t,n){return r.a.createElement(R.a,{className:"preset",onClick:function(){return e.onPresetClick(t)},key:"preset_"+n},t.title)})),r.a.createElement(I.a,null,"my presets:"),r.a.createElement(I.a,null,t.map(function(t,n){return r.a.createElement(R.a,{className:"preset",onMouseEnter:function(t){return e.showEditBtn(t,n)},onMouseLeave:function(t){return e.hideEditBtn(t,n)},onClick:function(){return e.onPresetClick(t)},key:"preset_"+n},t.title,r.a.createElement("div",{class:"x",style:{visibility:e.state.showEdit[n]?"":"hidden"},onClick:function(t){return e.onPresetEdit(t,n)}},"Edit"))})),r.a.createElement(I.a,null,r.a.createElement($,{ref:"presetEditor",onDeleteBtn:function(t){return e.onPresetDelete(t)},onSaveBtn:function(t,n){return e.onPresetEdit(t,n)},onSave:function(t,n){return e.onSavePreset(t,n)}})))}}]),t}(a.Component),Z=Q;Q.defaultProps={onSelect:function(e){}};var ee=function(e){function t(){return Object(c.a)(this,t),Object(p.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement(A.a,{className:"pane "+this.props.className},r.a.createElement(I.a,{className:"pane-title"},this.props.title),r.a.createElement(I.a,{className:"pane-body"},this.props.children))}}]),t}(a.Component),te=ee;ee.defaultProps={title:"title",children:[],className:""};var ne=n(188),ae=n(189),re=n(95),se=n.n(re),ie=function(e){function t(e){var n;Object(c.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).state={value:void 0,regression:void 0};var a=[[0,n.props.min],[100,n.props.max]];return n.state.regression=se.a.exponential(a,{precision:10}),console.log("slider func",n.state.regression.string),n.prepareMarks(),n.state.value=n.props.defaultValue,n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"prepareMarks",value:function(){this.marks={};for(var e=0;e<this.props.marksAt.length;e++)this.marks[this.findX(this.props.marksAt[e])]=this.props.marksAt[e]}},{key:"makeMark",value:function(e){return{label:this.props.markFormatter(Math.floor(e)),style:this.props.marksStyle}}},{key:"onChange",value:function(e){console.log("onChange",e);var t=Math.floor(this.state.regression.predict(e)[1]);this.setState({value:t}),this.props.onChange(t)}},{key:"findX",value:function(e){return Math.log(e)/this.state.regression.equation[1]}},{key:"setValue",value:function(e){this.setState({value:e})}},{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,r.a.createElement(C.a,{color:"light",onClick:this.onBadgeClick,className:"d-i"},this.props.badgeFormatter(this.state.value))),r.a.createElement(F.b,{ref:"slider",included:!1,value:this.findX(this.state.value),style:{height:"45px"},onChange:function(t){return e.onChange(t)},min:0,max:100,step:.5,marks:this.marks}))}}]),t}(a.Component),oe=ie;ie.defaultProps={marksNum:6,marksStyle:{color:"#ccc"},desc:"",badgeFormatter:function(e){return e},markFormatter:function(e){return e},defaultValue:50,marksAt:[]};var le=function(e){function t(){return Object(c.a)(this,t),Object(p.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement("div",null,r.a.createElement(C.a,{color:"light",className:"d-i"},this.state.bounds[0]," - ",this.state.bounds[1])),r.a.createElement("div",{style:{height:"30px"}},Object(Y.a)(Object(m.a)(t.prototype),"render",this).call(this)))}}]),t}(F.a),ce=function(e){function t(e){var n;return Object(c.a)(this,t),(n=Object(p.a)(this,Object(m.a)(t).call(this,e))).state={playMode:P.BY_TIME,bpmStep:10,bpmStepDropdownOpen:!1,byTimeInterval:5,byBarInterval:2,stableBpmSlider:300,bpmRange:[100,250]},n.onBpmSliderChange=function(e){console.log("onBpmSliderChange",e),n.setState({stableBpmSlider:e},n.props.onAfterChange)},n.state.playMode=e.playMode,e.playMode===P.BY_BAR?n.state.byBarInterval=e.interval:n.state.byTimeInterval=e.interval,n.state.bpmStep=e.bpmStep,n.state.bpmRange=e.bpmRange,console.log("<ModePanel> constructor"),n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"onModeChange",value:function(e){this.setState({playMode:e},this.props.onAfterChange)}},{key:"onBpmRangeChange",value:function(e){console.log("<ModePanel>onBpmRangeChange("+e[0]+")"),this.setState({bpmRange:e},this.props.onAfterChange)}},{key:"onBpmStepChange",value:function(){this.setState(function(e){return{bpmStepDropdownOpen:!e.bpmStepDropdownOpen}})}},{key:"onBpmStepSelect",value:function(e){this.setState({bpmStep:e},this.props.onAfterChange)}},{key:"getValue",value:function(){return{playMode:this.state.playMode,interval:this.state.playMode===P.BY_BAR?this.state.byBarInterval:this.state.byTimeInterval,bpmStep:this.state.bpmStep,bpmRange:this.state.playMode!==P.STABLE?this.state.bpmRange:this.props.bpmRange,stableBpmSlider:this.state.stableBpmSlider}}},{key:"setValue",value:function(e){console.log("<ModePanel>setValue",e),this.setState({playMode:e.playMode,bpmStep:e.bpmStep,byBarInterval:e.playMode===P.BY_BAR?e.interval:this.state.byBarInterval,byTimeInterval:e.playMode===P.BY_TIME?e.interval:this.state.byTimeInterval,bpmRange:e.bpmRange,stableBpmSlider:e.stableBpmSlider||this.state.stableBpmSlider},this.props.onAfterChange),(e.playMode===P.BY_BAR?this.refs.byBarSlider:this.refs.byTimeSlider).setValue(e.interval),this.refs.bpmRange.setState({bounds:e.bpmRange})}},{key:"onTimeIntervalChange",value:function(e){this.setState({byTimeInterval:e},this.props.onAfterChange)}},{key:"onBarIntervalChange",value:function(e){this.setState({byBarInterval:e},this.props.onAfterChange)}},{key:"byBarFormatter",value:function(e){var t=e+" ";return t+=1===e?"bar":"bars"}},{key:"byTimeFormatter",value:function(e){var t=M.formatTime(e)+" ";return t+=1===e?"second":e<60?"seconds":e<120?"minute":"minutes"}},{key:"renderIncreaseBpmDropdown",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,"increase speed by",r.a.createElement(_.a,{style:{margin:"0px 5px"},isOpen:this.state.bpmStepDropdownOpen,toggle:function(){return e.onBpmStepChange()}},r.a.createElement(N.a,{caret:!0,size:"sm",outline:!0,color:"light"},this.state.bpmStep),r.a.createElement(L.a,null,r.a.createElement(D.a,{onClick:function(){e.onBpmStepSelect(5)}},"5"),r.a.createElement(D.a,{onClick:function(){e.onBpmStepSelect(10)}},"10"),r.a.createElement(D.a,{onClick:function(){e.onBpmStepSelect(20)}},"20"),r.a.createElement(D.a,{onClick:function(){e.onBpmStepSelect(30)}},"30"),r.a.createElement(D.a,{onClick:function(){e.onBpmStepSelect(50)}},"50"))),"bpm")}},{key:"renderSpeedRange",value:function(){var e=this;return console.log("renderSpeedRange",this.state.bpmRange[0]),r.a.createElement("div",null,"Speed range",r.a.createElement(le,{ref:"bpmRange",min:30,max:600,defaultValue:[this.state.bpmRange[0],this.state.bpmRange[1]],pushable:!0,onAfterChange:function(t){return e.onBpmRangeChange(t)}}))}},{key:"render",value:function(){var e=this;return r.a.createElement(te,{className:"ModePanel",title:"Mode"},r.a.createElement(ne.a,{size:"sm"},r.a.createElement(S.a,{size:"sm",outline:!0,color:"light",onClick:function(){return e.onModeChange(P.BY_BAR)},active:this.state.playMode===P.BY_BAR},"By bar"),r.a.createElement(S.a,{size:"sm",outline:!0,color:"light",onClick:function(){return e.onModeChange(P.BY_TIME)},active:this.state.playMode===P.BY_TIME},"By time"),r.a.createElement(S.a,{size:"sm",outline:!0,color:"light",onClick:function(){return e.onModeChange(P.STABLE)},active:this.state.playMode===P.STABLE},"Stable")),r.a.createElement(ae.a,{isOpen:this.state.playMode!==P.STABLE},this.renderSpeedRange()),r.a.createElement(ae.a,{isOpen:this.state.playMode===P.BY_BAR},r.a.createElement("div",null,"Increase speed every",r.a.createElement(oe,{ref:"byBarSlider",defaultValue:this.state.byBarInterval,badgeFormatter:this.byBarFormatter,onChange:function(t){return e.onBarIntervalChange(t)},min:1,max:301,marksAt:[1,2,5,10,20,50,100,300]}))),r.a.createElement(ae.a,{isOpen:this.state.playMode===P.BY_TIME},r.a.createElement("div",null,"Increase speed every",r.a.createElement(oe,{ref:"byTimeSlider",defaultValue:this.state.byTimeInterval,badgeFormatter:this.byTimeFormatter,markFormatter:M.formatTime,onChange:function(t){return e.onTimeIntervalChange(t)},min:1,max:600,marksAt:[1,2,10,30,60,120,240,600]}))),this.state.playMode!==P.STABLE?this.renderIncreaseBpmDropdown():"",r.a.createElement(ae.a,{isOpen:this.state.playMode===P.STABLE},r.a.createElement("div",null,"Choose bpm",r.a.createElement(x,{ref:"stableBpmSlider",included:!1,min:10,max:600,marks:{30:"30",100:"100",200:"200",300:"300",400:"400",500:"500",600:"600"},value:this.state.stableBpmSlider,onChange:this.onBpmSliderChange}))))}}]),t}(a.Component),ue=ce;ce.defaultProps={onAfterChange:null};var pe=[{title:"4 beats every 4 bars",beatsPerStep:4,playMode:P.BY_BAR,interval:4,bpmStep:20,bpmRange:[100,400],accents:[0,1,2,1]},{title:"Jhaptal tabla",instrument:y.TABLA,beatsPerStep:10,bpmRange:[200,400],accents:[0,1,0,0,1,2,1,0,0,1],playMode:P.BY_TIME,interval:300,bpmStep:10},{title:"Balkan 1",bpmRange:[241,400],beatsPerStep:7,accents:[0,1,2,0,1,2,1],instrument:"electrokit",playMode:"by_bar",interval:20,bpmStep:30},{title:"Balkan 2",bpmRange:[293,400],beatsPerStep:7,accents:[0,1,2,0,1,2,1],instrument:"tabla",playMode:"by_bar",interval:300,bpmStep:50},{title:"Groove 1",bpmRange:[222,262],beatsPerStep:8,accents:[0,2,1,2,1,0,1,1],instrument:"electrokit",playMode:"by_time",interval:600,bpmStep:50},{title:"Groove 2",bpmRange:[222,400],beatsPerStep:8,accents:[0,2,0,2,2,2,0,1],instrument:"electrokit",playMode:"by_bar",interval:20,bpmStep:50}],me=function(e){function t(){var e,n;Object(c.a)(this,t);for(var a=arguments.length,r=new Array(a),s=0;s<a;s++)r[s]=arguments[s];return(n=Object(p.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).timer={timerRef:null,startTime:null},n.state={currentBpm:60,instrument:y.ELECTRO_KIT,instrumentDropdownOpen:!1,instrumentDropdownLabel:"Electro kit",cycleDropdownOpen:!1},n.onBeatsPerStepChange=function(){var e=n.getUiState().beatsPerStep;if(e!==n.refs.sm.beatsPerStep){for(var t=n.refs.barManager.getAccents();t.length>e;)t.pop();for(;t.length<e;)t.push(v.ACCENT_2);n.refs.sm.setBeatsPerStep(e),n.refs.barManager.setAccents(t),n.setState({beatsPerStep:e})}},n.onPlanAdvanced=function(e){e?(console.log("<App>onPlanAdvanced() new step:",e),n.setBpm(e.bpm)):(n.refs.planner.pause(),n.refs.sm.stop())},n.setBpm=function(e){n.setState({currentBpm:e}),n.refs.sm.setBpm(e)},n.onPlanChanged=function(){console.log("<App>onPlanChanged");var e=n.refs.planner.getCurrentBar();n.refs.sm.setLoopEnd(e.end||!1),e&&n.setBpm(e.bpm),n.refs.sm.state.isPlaying&&n.refs.planner.start()},n.onSoundMachineToggle=function(e){e?n.refs.planner.start():n.refs.planner.stop()},n}return Object(h.a)(t,e),Object(u.a)(t,[{key:"componentDidMount",value:function(){var e=this;this.refs.planner.setProgressEvent(this.refs.sm.loopEndEvent),this.refs.sm.setAccents(this.refs.barManager.getAccents()),document.addEventListener("keydown",function(t){return e.handleKeyDown(t)}),this.refs.planner.setPlan(this.getUiState()),this.initialized=!0}},{key:"handleKeyDown",value:function(e){switch(console.log("key",e),e.keyCode){case 32:this.refs.sm.handleStartStop();break;case 38:e.preventDefault(),this.state.currentBpm<600&&this.setBpm(this.state.currentBpm+10);break;case 40:e.preventDefault(),this.state.currentBpm>10&&this.setBpm(this.state.currentBpm-10);break;case 37:e.preventDefault(),this.refs.planner.stepBackward();break;case 39:e.preventDefault(),this.refs.planner.stepForward()}}},{key:"onInstrumentSelect",value:function(e){this.refs.sm.setInstrument(e);var t=this.refs.sm.getCurrentInstrumentLabel();console.log("setting new instrument. state.instrument",e),this.setState({instrument:e,instrumentDropdownLabel:t})}},{key:"renderPlaybackPane",value:function(){var e=this;return r.a.createElement(A.a,{className:"pane"},r.a.createElement(I.a,{className:"pane-title"},"PLAYBACK"),r.a.createElement(I.a,null,r.a.createElement(R.a,{xs:"3"},"Instrument"),r.a.createElement(R.a,null,r.a.createElement(_.a,{isOpen:this.state.instrumentDropdownOpen,toggle:function(){return e.onInstrumentChange()}},r.a.createElement(N.a,{caret:!0,size:"sm",outline:!0,color:"light"},this.state.instrumentDropdownLabel),r.a.createElement(L.a,null,r.a.createElement(D.a,{onClick:function(){e.onInstrumentSelect(y.TABLA)}},"Tabla"),r.a.createElement(D.a,{onClick:function(){e.onInstrumentSelect(y.ELECTRO_KIT)}},"Electro Kit"))))),r.a.createElement(I.a,null,r.a.createElement(R.a,{xs:3},"Beats per step"),r.a.createElement(R.a,null,r.a.createElement(x,{ref:"beatsPerStep",min:2,max:16,defaultValue:this.props.beatsPerStep,onAfterChange:function(){return e.onBeatsPerStepChange()}}))),r.a.createElement(I.a,null,r.a.createElement(R.a,{xs:3},"Accents"),r.a.createElement(R.a,null,r.a.createElement(z,{onAfterChange:function(){return e.onAccentsChange()},ref:"barManager",defaultValue:this.props.accents}))))}},{key:"onModePanelChanged",value:function(){console.log("<App>onModePanelChanged");var e=this.getUiState();e.playMode===P.BY_BAR&&this.refs.sm.setLoopEnd(e.bars),this.refs.planner.setPlan(e)}},{key:"renderRightPane",value:function(){return r.a.createElement(A.a,null,r.a.createElement(I.a,null,r.a.createElement(R.a,null,this.renderPresetsPane())))}},{key:"renderLeftPane",value:function(){var e=this;return console.log("Tone.transzport",f.a.Transport.state),r.a.createElement(A.a,null,r.a.createElement(I.a,null,r.a.createElement(R.a,null,r.a.createElement(te,{title:"Control"},r.a.createElement(B,{ref:"sm",beatsPerStep:this.state.beatsPerStep,onLoopEnd:function(){return e.onLoopEnd()},onBeat:function(t){return e.onBeat(t)},instrument:this.state.instrument,onToggle:function(t){return e.onSoundMachineToggle(t)}})))),r.a.createElement(I.a,null,r.a.createElement(R.a,null,r.a.createElement(ue,{ref:"modePanel",playMode:this.props.playMode,interval:this.props.interval,bpmStep:this.props.bpmStep,bpmRange:this.props.bpmRange,currentBpm:this.state.currentBpm,onAfterChange:function(){return e.onModePanelChanged()}}))),r.a.createElement(I.a,null,r.a.createElement(R.a,null,this.renderPlaybackPane())))}},{key:"renderPresetsPane",value:function(){var e=this;return r.a.createElement(A.a,{className:"pane"},r.a.createElement(I.a,{className:"pane-title"},"Presets"),r.a.createElement(Z,{ref:"presetsManager",preset:this.uiState,cookies:this.props.cookies,presets:pe,onSelect:function(t){return e.onPresetSelect(t)}}))}},{key:"onPresetSelect",value:function(e){console.log("setting preset",e),this.refs.beatsPerStep.setState({value:e.beatsPerStep}),this.refs.sm.setBeatsPerStep(e.beatsPerStep),this.onInstrumentSelect(e.instrument||y.TABLA),this.refs.barManager.setAccents(e.accents,e.beatsPerStep),this.refs.modePanel.setValue(e)}},{key:"renderMidPane",value:function(){var e=this;return r.a.createElement(A.a,null,r.a.createElement(I.a,null,r.a.createElement(R.a,null,r.a.createElement(te,{title:"Plan"},r.a.createElement(j,{currentBpm:this.state.currentBpm,onChange:function(){return e.onPlanChanged()},onAdvance:function(t){return e.onPlanAdvanced(t)},ref:"planner"})))))}},{key:"onLoopEnd",value:function(){this.getUiState().playMode===P.BY_BAR&&(console.log("onLoopEnd fetched"),this.refs.planner.stepForward())}},{key:"onBeat",value:function(e){this.refs.barManager.setActive(e)}},{key:"render",value:function(){return document.title="BPM: "+this.state.currentBpm.toFixed(0)+" | SpeedTrainer",r.a.createElement("div",{className:"App"},r.a.createElement(A.a,{className:"app-container"},r.a.createElement(I.a,null,r.a.createElement(R.a,null,this.renderLeftPane()),r.a.createElement(R.a,null,this.renderMidPane())),r.a.createElement(I.a,null,r.a.createElement(R.a,null,this.renderRightPane()))))}},{key:"onInstrumentChange",value:function(){this.setState(function(e){return{instrumentDropdownOpen:!e.instrumentDropdownOpen}})}},{key:"getUiState",value:function(){var e={beatsPerStep:this.refs.beatsPerStep.getValue(),accents:this.refs.barManager.getAccents(),instrument:this.state.instrument},t=this.refs.modePanel.getValue(),n=Object(l.a)({},e,t);return console.log("storing uiState",this.uiState),this.uiState=n,this.uiState.instrument=this.state.instrument,n}},{key:"onAccentsChange",value:function(){this.refs.sm.setAccents(this.refs.barManager.getAccents())}}]),t}(a.Component),he=Object(o.b)(me);me.defaultProps={playMode:P.BY_BAR,interval:2,instrument:y.TABLA,bpmStep:50,bpmRange:[120,560],beatsPerStep:4,accents:[0,1,2,1]};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(o.a,null," ",r.a.createElement(he,null)," "),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},97:function(e,t,n){e.exports=n(176)}},[[97,2,1]]]);
//# sourceMappingURL=main.d9cfde30.chunk.js.map