package hoainguyen.gama.GamaProject.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import hoainguyen.gama.GamaProject.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>  {
	
	Optional<User> findById(Long id);
	
	@Query(value = "select u from User u where u.email=?1")
	User findByEmail(String email);
}
