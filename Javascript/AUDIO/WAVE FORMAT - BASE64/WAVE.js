
function Apple (type) {
    this.type = type;
    this.color = "red";
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };
}

function WaveBundler(ch1_data, sample_rate, sample_size )
{
	//check for errors
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
	}
	
	
	
	this.returnWaveFile = function () {
		var data = new Array(); //for returning
		var temp = 0; //we shall use this later 
		// i would refine this down to a simple hex array but,
		//i would like make it easy for someone to learn the wave format
		
		//the RIFF HEADER
		//0 - 4 | basic magic number :D | "RIFF"
		data[0] = 'R';
		data[1] = 'I';
		data[2] = 'F';
		data[3] = 'F';
		
		// 4 - 4 | Size of the file minus 8 bytes for these 2 field's | 0x00FF
		
		data[4] = 0;
		data[5] = 0;
		data[6] = 0;
		data[7] = 0;
		
		//the WAVE HEADER
		//8 - 4 | a magic number :D :D  | "WAVE"
		
		data[8]  = 'W';
		data[9]  = 'A';
		data[10] = 'V';
		data[11] = 'E';
		
		//12 - 4 	| more magic  | "fmt " // thats a space got to be 4 bytes
		
		data[12] = 'f';
		data[13] = 'm';
		data[14] = 't';
		data[15] = ' ';
		
		//16 - 4  | size of sub-chunk | apparently 16, bc i only want PCM // will have to look at other formats
		
		data[16] = 0x00;
		data[17] = 0x00;
		data[18] = 0x01;
		data[19] = 0x00;
		
		//20 - 2  | AudioFormat 1=PCM other = compression | 0x01 //remember 2 bytes
		
		data[20] = 0x00;
		data[21] = 0x01;
		
		//22 - 2  | channels				| 0x01 //remember 2 bytes
		//only using single channel for this will modify later, im sure there is much better javascrpt wave libs out their
		
		data[22] = 0x00;
		data[23] = 0x01;
		
		//24 - 4  | sample rate	| 8000, 44100, etc. //will have to research if custom numbers allowed, could be used to slow down the audio ???
		
		data[24] = this.sample_rate >> 24;
		data[25] = (this.sample_rate >> 16) & (0x00000011);
		data[26] = (this.sample_rate >> 8) & (0x00000011);
		data[27] = (this.sample_rate & 0x00000011);
		
		//28 - 4	| byte-rate	SampleRate * NumChannels * BitsPerSample/8    | interseting, if i made a wave player i would do this calculation not read this feild
		
		temp = Number((this.sample_rate * 1) * (this.sample_size /8));
		
		data[28] = temp >> 24;
		data[29] = (temp >> 16) & (0x00000011);
		data[30] = (temp >> 8) & (0x00000011);
		data[31] = (temp & 0x00000011);
		
		//32 - 2  | NumChannels * BitsPerSample/8 | //look into multiple channels
		
		temp = Number((1) * (this.sample_size /8));
		data[32] = (temp & 0x00001100);
		data[33] = (temp & 0x00000011);
		
		//34 - 2  | bits per sample | 0x08 //8 bit all the way?
		
		data[34] = (this.sample_size & 0x00001100);
		data[35] = (this.sample_size & 0x00000011);
		
		
		//datasubchunck
		
		data[36] = 'd';
		data[37] = 'a';
		data[38] = 't';
		data[39] = 'a';
		
		//40 - 4 | subchunck size | 0x00FF // so 2gb of data max?, or is it unsigned ?
		//TODO:
		data[40] = 0x00;
		data[41] = 0x00;
		data[42] = 0x00;
		data[43] = 0x0F;
		
		
		//TODO
		
		return data;
		
	}
	
	
	
	
	//this.returnHeaderBASE64()
	
}