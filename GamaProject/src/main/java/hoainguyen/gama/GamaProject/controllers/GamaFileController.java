package hoainguyen.gama.GamaProject.controllers;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hoainguyen.gama.GamaProject.entities.GamaFile;
import hoainguyen.gama.GamaProject.repository.GamaFileRepository;

@RestController
@RequestMapping("/api")
public class GamaFileController {

	@Autowired
	private GamaFileRepository gamaFileRepository;

	@GetMapping("/gama-files")
	public List<GamaFile> getGamaFilesByProjectId(@RequestParam Long projectId) {
		return gamaFileRepository.findByProjectId(projectId);
	}

	@GetMapping("/gama-files/{id}")
	public Optional<GamaFile> getGamaFilesById(@PathVariable Long id) {
		return gamaFileRepository.findById(id);
	}

	@PostMapping("/gama-files")
	public GamaFile createGamaFile(@Valid @RequestBody GamaFile gamaFile) {
		writeFile(gamaFile);
		return gamaFileRepository.save(gamaFile);
	}
	
	@PostMapping("/gama-files/create-gama-folder")
	public void createGamaFolder(@Valid @RequestBody GamaFile gamaFile) {
		createFolder(gamaFile);
	}

	@PutMapping("/gama-files")
	public GamaFile editGamaFile(@Valid @RequestBody GamaFile gamaFile) {
		writeFile(gamaFile);
		return gamaFileRepository.save(gamaFile);
	}

	@DeleteMapping("/gama-files/{id}")
	public void deleteGamaFile(@PathVariable Long id) {
		gamaFileRepository.deleteById(id);
	}

	public void writeFile(GamaFile gamaFile) {
		FileOutputStream fos = null;
		File file;
		String mycontent = gamaFile.getContent();
		try {
			File folder = new File("/home/duyduong/Desktop/Project/Samples/" + gamaFile.getFolderName());
			if(!folder.exists()) {
				folder.mkdir();
				File folderModel = new File("/home/duyduong/Desktop/Project/Samples/" + gamaFile.getFolderName() + "/models");
				if(!folderModel.exists()) {
					folderModel.mkdir();
				}
			} 
			
			// Specify the file path here
			file = new File("/home/duyduong/Desktop/Project/Samples/" + gamaFile.getFolderName() + "/models/"
					+ gamaFile.getName());
			fos = new FileOutputStream(file);

			if (!file.exists()) {
				file.createNewFile();
			}

			byte[] bytesArray = mycontent.getBytes();

			fos.write(bytesArray);
			fos.flush();
			System.out.println("File Written Successfully");
		} catch (IOException ioe) {
			ioe.printStackTrace();
		} finally {
			try {
				if (fos != null) {
					fos.close();
				}
			} catch (IOException ioe) {
				System.out.println("Error in closing the Stream");
			}
		}
	}

	public void createFolder(GamaFile gamaFile) {
		File file = new File("/home/duyduong/Desktop/Project/Samples/" + gamaFile.getFolderName() + "/models");
		// Creating the directory
		boolean bool = file.mkdir();
		if (bool) {
			System.out.println("Directory created successfully");
		} else {
			System.out.println("Sorry couldn’t create specified directory");
		}
	}
}
