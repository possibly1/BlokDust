import IEffect = require("../IEffect");
import Effect = require("../Effect");
import IModifiable = require("../IModifiable");
import Type = require("../BlockType");
import BlockType = Type.BlockType;


class PitchComponent extends Effect implements IEffect {

    public PitchIncrement: number;
    public Pitch: number;
    public isConnected: boolean = false;

    constructor(increment) {
        super();
        this.PitchIncrement = increment;
    }

    Connect(modifiable: IModifiable): void {
        super.Connect(modifiable);

        if (this.Modifiable.Source.frequency){
            this.Pitch = this.Modifiable.Source.frequency.getValue();
            this.Modifiable.Source.frequency.exponentialRampToValueNow(this.Pitch * this.PitchIncrement, 0);
        } else if (this.Modifiable.Source._playbackRate){
            this.Pitch = this.Modifiable.Source.getPlaybackRate();
            this.Modifiable.Source.setPlaybackRate(this.Pitch * this.PitchIncrement, 0);
        }
    }

    Disconnect(modifiable: IModifiable): void{
        super.Disconnect(modifiable);

        if (this.Modifiable.Source.frequency) {
            this.Pitch = this.Modifiable.Source.frequency.getValue();
            this.Modifiable.Source.frequency.exponentialRampToValueNow(this.Pitch / this.PitchIncrement, 0);
        } else if (this.Modifiable.Source._playbackRate){
            this.Pitch = this.Modifiable.Source.getPlaybackRate();
            this.Modifiable.Source.setPlaybackRate(this.Pitch / this.PitchIncrement, 0);
        }
    }

    Delete() {

    }

    SetValue(param: string,value: number) {
        super.SetValue(param,value);
        var jsonVariable = {};
        jsonVariable[param] = value;

        if (param == "pitchMultiplier") {
            this.PitchIncrement = value;
            if (this.Modifiable && this.Modifiable.Source.frequency) {
                this.Modifiable.Source.frequency.linearRampToValueAtTime(this.Pitch * this.PitchIncrement, 0 );
            } else if (this.Modifiable && this.Modifiable.Source._playbackRate) {
                this.Modifiable.Source.setPlaybackRate(this.Pitch * this.PitchIncrement, 0);
            }
        }
    }

    GetValue(param: string) {
        super.GetValue(param);
        var val;

        if (param == "pitchMultiplier") {
            val = this.PitchIncrement;
        }
        return val;
    }
}

export = PitchComponent;