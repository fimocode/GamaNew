package hoainguyen.gama.GamaProject.controllers;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import javax.validation.Valid;
import hoainguyen.gama.GamaProject.entities.User;
import hoainguyen.gama.GamaProject.repository.UserRepository;
import hoainguyen.gama.GamaProject.service.CommonService;

@RestController
@RequestMapping("/api")
public class UserController {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private CommonService commonService;

	@GetMapping("/users")
	public List<User> getUsers() {
		return userRepository.findAll();
	}

	@PostMapping("/users")
	public User createUser(@Valid @RequestBody User user) {
		String password = commonService.encodePassword(user.getPassword());
		user.setPassword(password);
		return userRepository.save(user);
	}
	
	@PostMapping("/users/login")
	public User login(@Valid @RequestBody User user) {
		User userExist = userRepository.findByEmail(user.getEmail());
		String password = commonService.encodePassword(user.getPassword());
		if(userExist.getPassword().equals(password)) {
			return userExist;
		} else {
			return null;
		}
	}

	@DeleteMapping("/users")
	public void deleteUser(@PathVariable Long id) {
		userRepository.deleteById(id);
	}

}
