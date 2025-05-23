namespace LMS.BusinessLogic.DTOs.ResponseDTO
{
    public class StudentSubmissionHistoryDTO
    {
        public Guid SubmissionId { get; set; }
        public Guid ExerciseId { get; set; }
        public Guid StudentId { get; set; }
        public int Status { get; set; }
        
        public string Code { get; set; }
        public string ProgrammingLanguage { get; set; }
        public DateTime SubmitDate { get; set; }
        public int ExecutionTime { get; set; }
        public int MemoryUsed { get; set; }

    }
}
