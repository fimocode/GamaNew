package hoainguyen.gama.GamaProject.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tbl_gama_file")
public class GamaFile {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(name = "name", nullable = false)
    private String name;
	
	@Column(name = "content", nullable = false)
    private String content;
	
	@Column(name = "path", nullable = false)
    private String path;
	
	@Column(name = "output_name")
    private String outputName;
	
	@Column(name = "final_step")
    private int finalStep;
	
	@Column(name = "folder_name")
    private String folderName;
	
	@Column(name = "project_id")
    private Long projectId;

	public GamaFile() {
		super();
	}

	public GamaFile(Long id, String name, String content, String path, String outputName, int finalStep, String folderName, Long projectId) {
		super();
		this.id = id;
		this.name = name;
		this.content = content;
		this.path = path;
		this.projectId = projectId;
		this.outputName = outputName;
		this.folderName = folderName;
		this.finalStep = finalStep;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public Long getProjectId() {
		return projectId;
	}

	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}

	public String getOutputName() {
		return outputName;
	}

	public void setOutputName(String outputName) {
		this.outputName = outputName;
	}

	public int getFinalStep() {
		return finalStep;
	}

	public void setFinalStep(int finalStep) {
		this.finalStep = finalStep;
	}

	public String getFolderName() {
		return folderName;
	}

	public void setFolderName(String folderName) {
		this.folderName = folderName;
	}
	
}
