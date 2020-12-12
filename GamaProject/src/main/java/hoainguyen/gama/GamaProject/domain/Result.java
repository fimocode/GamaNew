package hoainguyen.gama.GamaProject.domain;

public class Result {

	String inputPath;
	String outputPath;
	
	public Result() {
		super();
	}
	
	public Result(String inputPath, String outputPath) {
		super();
		this.inputPath = inputPath;
		this.outputPath = outputPath;
	}
	
	public String getInputPath() {
		return inputPath;
	}
	
	public void setInputPath(String inputPath) {
		this.inputPath = inputPath;
	}
	
	public String getOutputPath() {
		return outputPath;
	}
	
	public void setOutputPath(String outputPath) {
		this.outputPath = outputPath;
	}
}
