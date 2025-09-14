<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\ExamRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ExamRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['exam:read']],
    denormalizationContext: ['groups' => ['exam:write']],
    operations: [
        new GetCollection(),
        new Get(),
        new Post()
    ]
)]
class Exam
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['exam:read', 'exam:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['exam:read', 'exam:write'])]
    #[Assert\NotBlank(message: "Le nom de l'étudiant est requis")]
    #[Assert\Length(min: 2, max: 255, minMessage: "Le nom doit comporter 2 lettres minimum", maxMessage: "Le nom doit comporter 255 lettres maximum")]
    private ?string $studentName = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['exam:read', 'exam:write'])]
    private ?string $location = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Groups(['exam:read', 'exam:write'])]
    #[Assert\NotNull(message: "La date est requise")]
    #[Assert\GreaterThanOrEqual("today", message: "La date doit être dans le futur")]
    private ?\DateTime $date = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Groups(['exam:read', 'exam:write'])]
    #[Assert\NotNull(message: "L'heure est requise")]
    private ?\DateTime $time = null;

    #[ORM\Column(length: 50)]
    #[Groups(['exam:read', 'exam:write'])]
    #[Assert\NotBlank(message: "Le statut est requis")]
    #[Assert\Choice(
        choices: ['Confirmé', 'À organiser', 'Annulé', 'En recherche de place'],
        message: "Le statut doit être: Confirmé, À organiser, Annulé, ou En recherche de place"
    )]
    private ?string $status = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStudentName(): ?string
    {
        return $this->studentName;
    }

    public function setStudentName(string $studentName): static
    {
        $this->studentName = $studentName;

        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(?string $location): static
    {
        $this->location = $location;

        return $this;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(\DateTime $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getTime(): ?\DateTime
    {
        return $this->time;
    }

    public function setTime(\DateTime $time): static
    {
        $this->time = $time;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    #[Groups(['exam:read', 'exam:write'])]
    public function getTimeFormatted(): ?string
    {
        if ($this->time === null) {
            return null;
        }

        return $this->formatTimeDisplay($this->time);
    }

    private function formatTimeDisplay(\DateTime $time): string
    {
        $hours = $time->format('H');
        $minutes = $time->format('i');

        $formattedTime = $hours . 'h';

        if ($minutes !== '00') {
            $formattedTime .= ' ' . $minutes;
        }

        return $formattedTime;
    }


    #[Groups(['exam:write'])]
    public function setTimeFormatted(?string $time): self
    {
        if ($time) {
            $dateTime = \DateTime::createFromFormat('H:i', $time);

            if ($dateTime === false) {
                throw new \InvalidArgumentException("Format d'heure invalide. Utilisez le format H:i (ex: 14:30)");
            }

            $this->time = $dateTime;
        } else {
            $this->time = null;
        }
        return $this;
    }
}
