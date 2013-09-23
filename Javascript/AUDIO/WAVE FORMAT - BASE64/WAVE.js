var FastBase64 = {

    chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encLookup: [],

    Init: function() {
        for (var i=0; i<4096; i++) {
            this.encLookup[i] = this.chars[i >> 6] + this.chars[i & 0x3F];
        }
    },

    Encode: function(src) {
        var len = src.length;
        var dst = '';
        var i = 0;
        while (len > 2) {
            n = (src[i] << 16) | (src[i+1]<<8) | src[i+2];
            dst+= this.encLookup[n >> 12] + this.encLookup[n & 0xFFF];
            len-= 3;
            i+= 3;
        }
        if (len > 0) {
            var n1= (src[i] & 0xFC) >> 2;
            var n2= (src[i] & 0x03) << 4;
            if (len > 1) n2 |= (src[++i] & 0xF0) >> 4;
            dst+= this.chars[n1];
            dst+= this.chars[n2];
            if (len == 2) {
                var n3= (src[i++] & 0x0F) << 2;
                n3 |= (src[i] & 0xC0) >> 6;
                dst+= this.chars[n3];
            }
            if (len == 1) dst+= '=';
            dst+= '=';
        }
        return dst;
    } // end Encode

}

FastBase64.Init();


function WaveBundler()
{
	/*//check for errors
	if (ch1_data instanceof Array)
	{
		this.ch1_data = ch1_data;
	}
	else
	{
		throw "EXCEPTION: ch1_data is not an array \n";
	}
	
	if (Number(sample_rate) != NaN)
	{
		this.sample_rate = Number(sample_rate);
	}
	else
	{
		throw "EXCEPTION: rate not a number \n";
	}
	
	if (Number(sample_size) != NaN)
	{
		this.sample_size = Number(sample_size);
	}
	else
	{
		throw "EXCEPTION: sample_size nto a number";
	}*/
	

	//audio must be an array, of x 8bit numbers
	this.betterWAVEformat = function (NumSamples, NumChannels, BitsPerSample, audio) {
		
		var data =  [ 
					0x52, 0x49, 0x46, 0x46,  /* RIFF in big endian  */
					0xFF, 0xFF, 0xFF, 0xFF,  /* file size - 8 bytes */ 
					0x57, 0x41, 0x56, 0x45,  /* WAVE in big endian */ 
					
					0x66, 0x6d, 0x74, 0x20,  /* 'fmt ' in big endian */
					0x10, 0x00, 0x00, 0x00,  /* 16 for PCM */
					0x01, 0x00,				 /* 1 for no compression*/
					0x01, 0x00,				 /* No. of channels for now just 1 */
					0xFF, 0xFF, 0xFF, 0xFF,  /* SampleRate e.g 8000,44100  */ 
					0xFF, 0xFF, 0xFF, 0xFF,  /* byterate == SampleRate * NumChannels * BitsPerSample/8   */
					0xFF, 0xFF,				 /* Block align == NumChannels * BitsPerSample/8*/
					0xFF, 0xFF,				 /* Bits persmaple */
					
					0x64, 0x61, 0x74, 0x61,	 /* 'data' in big endian  */
					0xFF, 0xFF, 0xFF, 0xFF  /* Subchunk2Size    == NumSamples * NumChannels * BitsPerSample/8 */
					/*SOUND DATA*/
					
					];
		
		//concat audio to the end
		data = data.concat(audio);

		
		//change filesize
		data[7] = (data.length-8) >> 24;
		data[6] = ((data.length-8) >> 16) & (0x000000FF);
		data[5] = ((data.length-8) >> 8) & (0x000000FF);
		data[4] = ((data.length-8) & 0x000000FF);
		
		//change number of channels
		data[22] = NumChannels & 0xFF;
		data[23] = (NumChannels >> 8) & (0x000000FF);
		
		//change sample rate
		data[27] = NumSamples >> 24;
		data[26] = (NumSamples >> 16) & (0x000000FF);
		data[25] = (NumSamples >> 8) & (0x000000FF);
		data[24] = (NumSamples & 0x000000FF);
		
		//byte rate
		var temp = Number((NumSamples * 1) * (BitsPerSample /8));
		
		data[31] = temp >> 24;
		data[30] = (temp >> 16) & (0x000000FF);
		data[29] = (temp >> 8) & (0x000000FF);
		data[28] = (temp & 0x000000FF);
		
		//block align
		temp = Number((1) * (BitsPerSample /8));
		data[33] = (temp & 0x00001100);
		data[32] = (temp & 0x000000FF);
		
		//bits per sample
		data[35] = (BitsPerSample & 0x00001100);
		data[34] = (BitsPerSample & 0x000000FF);
		
		// Subchunk2Size
		temp = Number((NumSamples * 1) * (BitsPerSample /8));
		
		data[40] = temp >> 24;
		data[41] = (temp >> 16) & (0x000000FF);
		data[42] = (temp >> 8) & (0x000000FF);
		data[43] = (temp & 0x000000FF);
		
		
		
		return data;
	}
}

//setup class
window.onload = function () {
	var classy = new WaveBundler();
	
	var data = [];
	
	for (var i = 0; i < 25600; i++)
	{
		data.push(Math.floor((Math.random()*255)+1));
	}
	
	var str = classy.betterWAVEformat(4000,1,8,data);
	

	
	console.log("data:audio/wav;base64," + FastBase64.Encode(str));

	var snd = new Audio("data:audio/wav;base64," + window.btoa(example));
	snd.play();
}


