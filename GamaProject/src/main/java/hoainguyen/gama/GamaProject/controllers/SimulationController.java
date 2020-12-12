package hoainguyen.gama.GamaProject.controllers;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.validation.Valid;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import hoainguyen.gama.GamaProject.domain.Output;
import hoainguyen.gama.GamaProject.domain.Result;
import hoainguyen.gama.GamaProject.domain.Simulation;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.UploadObjectArgs;
import io.minio.errors.MinioException;

@RestController
@RequestMapping("/api")
public class SimulationController {

	@PostMapping("/simulation/createFileXml")
	public void createFileXml(@Valid @RequestBody Simulation simulation) throws Exception {

		JAXBContext contextObj = JAXBContext.newInstance(Simulation.class);

		Marshaller marshallerObj = contextObj.createMarshaller();
		marshallerObj.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

		// Write data to console
		marshallerObj.marshal(simulation, System.out);
		File theDir = new File("../Samples/" + simulation.getFolderName());
		if (!theDir.exists()) {
			theDir.mkdirs();
		}

		// Write data to file xml
		marshallerObj.marshal(simulation, new FileOutputStream(
				"../Samples/" + simulation.getFolderName() + "/" + simulation.getFolderName() + ".xml"));
	}

	@PostMapping("/simulation/runFileXml")
	public void runFileXml(@Valid @RequestBody Result result) {
		try {
			String command = "bash gama-headless.sh " + result.getInputPath() + " " + result.getOutputPath();
			Process proc = Runtime.getRuntime().exec(command);

			// Read the output

			BufferedReader reader = new BufferedReader(new InputStreamReader(proc.getInputStream()));

			String line = "";
			while ((line = reader.readLine()) != null) {
				System.out.print(line + "\n");
			}
			proc.waitFor();
		} catch (Exception e) {
			// TODO: handle exception
		}
	}

	@PutMapping("/simulation/map")
	public Output mapGama(@Valid @RequestBody Output result) throws IOException, NoSuchAlgorithmException, InvalidKeyException {
		try {
			// Create a minioClient with the MinIO server playground, its access key and
			// secret key.
			MinioClient minioClient = MinioClient.builder().endpoint("https://play.min.io")
					.credentials("Q3AM3UQ867SPQQA43P2F", "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG").build();

			boolean found = minioClient.bucketExists(BucketExistsArgs.builder().bucket("demogama").build());
			if (!found) {
				minioClient.makeBucket(MakeBucketArgs.builder().bucket("demogama").build());
			} else {
				System.out.println("Bucket 'demogama' already exists.");
			}
			System.out.println(result);
			// Upload file as object name
			for (String item : result.getUrlImage()) {
				minioClient.uploadObject(
						UploadObjectArgs.builder().bucket("demogama").object(result.getName() + "/snapshot/" + item).filename(result.getName() + "/snapshot/" + item).build());
			}
			System.out.println("successfully uploaded");
			return result;
		} catch (MinioException e) {
			System.out.println("Error occurred: " + e);
			return null;
		}
	}
}
